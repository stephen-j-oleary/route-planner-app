import { act, render, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Logic, { FIELD_NAMES } from "./Logic";
import createUseFormMock from "@/__utils__/createUseFormMock";
import createUseMutationMock from "@/__utils__/createUseMutationMock";

const formViewMock = jest.fn();
jest.mock(
  "@/components/Subscriptions/Form/View",
  () => (
    function FormViewMock(props) {
      formViewMock(props);
      return <div data-testid="form-view-mock" />;
    }
  )
);

const MINIMAL_PROPS = {
  products: {},
  prices: {},
};
const createOptionsProps = (...groups) => ({
  products: {
    data: groups.flatMap(item => item.products),
  },
  prices: {
    data: groups.flatMap(item => item.prices),
  },
});

const group = (id, ...products) => ({
  products: products.map(item => ({
    ...item,
    metadata: { plan: `${id} - ${item.id}` },
  })),
  prices: products.flatMap(item => (
    item.prices
  )),
});

const product = (id, ...prices) => ({
  id,
  prices: prices.map(item => ({
    ...item,
    product: id,
  })),
});

const price = (id) => ({ id });


function getFormMock() {
  return formViewMock.mock.lastCall[0].form;
}

describe("SubscriptionFormLogic", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("has the expected getProps methods", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    expect(formViewMock).toBeCalledWith(expect.objectContaining({
      getFormProps: expect.any(Function),
      getInputProps: expect.any(Function),
      getSubmitProps: expect.any(Function),
      getPreviewProps: expect.any(Function),
    }));
  });

  it("has a form and form state", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    expect(formViewMock).toBeCalledWith(expect.objectContaining({
      isError: expect.any(Boolean),
      error: expect.anything(),
      form: expect.any(Object),
    }));
  });

  it("has the hasCustomerSubscriptions prop that was passed", () => {
    const hasCustomerSubscriptions = true;
    render(
      <Logic
        {...MINIMAL_PROPS}
        hasCustomerSubscriptions={hasCustomerSubscriptions}
      />
    );

    expect(formViewMock).toBeCalledWith(expect.objectContaining({
      hasCustomerSubscriptions,
    }));
  });

  it("has the expected groupOptions", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group("plan1", product("prod1", price("price1"))),
          group("plan2", product("prod2", price("price2"))),
          group("plan3", product("prod3", price("price3"))),
        )}
      />
    );

    expect(formViewMock.mock.lastCall[0].getInputProps()).toEqual(expect.objectContaining({
      groupOptions: expect.objectContaining({
        plan1: expect.any(Array),
        plan2: expect.any(Array),
        plan3: expect.any(Array),
      }),
    }));
  });

  it("has the expected productOptions", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product("prod1", price("price1")),
            product("prod2", price("price2")),
            product("prod3", price("price3")),
          ),
        )}
      />
    );

    expect(formViewMock.mock.lastCall[0].getInputProps()).toEqual(expect.objectContaining({
      productOptions: expect.arrayContaining([
        expect.objectContaining({ id: "prod1" }),
        expect.objectContaining({ id: "prod2" }),
        expect.objectContaining({ id: "prod3" }),
      ]),
    }));
  });

  it("has the expected priceOptions", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product(
              "prod1",
              price("price1"),
              price("price2"),
              price("price3"),
            ),
          ),
        )}
      />
    );

    expect(formViewMock.mock.lastCall[0].getInputProps()).toEqual(expect.objectContaining({
      priceOptions: expect.arrayContaining([
        expect.objectContaining({ id: "price1" }),
        expect.objectContaining({ id: "price2" }),
        expect.objectContaining({ id: "price3" }),
      ]),
    }));
  });

  it("has the expected default group value", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group("plan1", product("prod1", price("price1"))),
          group("plan2", product("prod2", price("price2"))),
        )}
      />
    );
    const form = getFormMock();


    expect(form.getValues(FIELD_NAMES.group)).toBe("");
  });

  it("selects single group option", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group("plan1", product("prod1", price("price1"))),
        )}
      />
    );
    const form = getFormMock();

    expect(form.getValues(FIELD_NAMES.group)).not.toBe("");
  });

  it("has the expected default product value", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product("prod1", price("price1")),
            product("prod2", price("price2")),
          )
        )}
      />
    );
    const form = getFormMock();

    expect(form.getValues(FIELD_NAMES.product)).toBe("");
  });

  it("selects single product option after single group option", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group("plan1", product("prod1", price("price1"))),
        )}
      />
    );
    const form = getFormMock();

    expect(form.getValues(FIELD_NAMES.group)).not.toBe("");
    expect(form.getValues(FIELD_NAMES.product)).not.toBe("");
  });

  it("selects single product option after group select", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group("plan1", product("prod1", price("price1"))),
          group("plan2", product("prod2", price("price2"))),
        )}
      />
    );
    const form = getFormMock();

    expect(form.getValues(FIELD_NAMES.product)).toBe("");
    act(() => {
      form.setValue(FIELD_NAMES.group, "plan1");
    });
    expect(form.getValues(FIELD_NAMES.product)).not.toBe("");
  });

  it("clears product selection when group selection changes", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product("prod1", price("price1")),
            product("prod2", price("price2")),
          ),
          group(
            "plan2",
            product("prod3", price("price3")),
            product("prod4", price("price4")),
          ),
        )}
      />
    );
    const form = getFormMock();

    act(() => {
      form.setValue(FIELD_NAMES.group, "plan1");
      form.setValue(FIELD_NAMES.product, "prod1");
    });
    expect(form.getValues(FIELD_NAMES.product)).toBe("prod1");

    act(() => {
      form.setValue(FIELD_NAMES.group, "plan2");
    });
    expect(form.getValues(FIELD_NAMES.product)).toBe("");
  });

  it("keeps product selection when current group selection is pressed again", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product("prod1", price("price1")),
            product("prod2", price("price2")),
          ),
          group(
            "plan2",
            product("prod3", price("price3")),
            product("prod4", price("price4")),
          ),
        )}
      />
    );
    const form = getFormMock();

    act(() => {
      form.setValue(FIELD_NAMES.group, "plan1");
      form.setValue(FIELD_NAMES.product, "prod1");
    });
    expect(form.getValues(FIELD_NAMES.product)).toBe("prod1");

    act(() => {
      form.setValue(FIELD_NAMES.group, "plan1");
    });
    expect(form.getValues(FIELD_NAMES.product)).toBe("prod1");
  });

  it("has the expected default price value", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product(
              "prod1",
              price("price1"),
              price("price2"),
            ),
          )
        )}
      />
    );
    const form = getFormMock();

    expect(form.getValues(FIELD_NAMES.price)).toBe("");
  });

  it("selects single price option after single product option", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group("plan1", product("prod1", price("price1"))),
        )}
      />
    );
    const form = getFormMock();

    expect(form.getValues(FIELD_NAMES.product)).not.toBe("");
    expect(form.getValues(FIELD_NAMES.price)).not.toBe("");
  });

  it("selects single price option after product select", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product("prod1", price("price1")),
            product("prod2", price("price2")),
          ),
        )}
      />
    );
    const form = getFormMock();

    expect(form.getValues(FIELD_NAMES.price)).toBe("");
    act(() => {
      form.setValue(FIELD_NAMES.product, "prod1");
    });
    expect(form.getValues(FIELD_NAMES.price)).not.toBe("");
  });

  it("clears price selection when product selection changes", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product(
              "prod1",
              price("price1"),
              price("price2"),
            ),
            product(
              "prod2",
              price("price3"),
              price("price4"),
            ),
          ),
        )}
      />
    );
    const form = getFormMock();

    act(() => {
      form.setValue(FIELD_NAMES.product, "prod1");
      form.setValue(FIELD_NAMES.price, "price1");
    });
    expect(form.getValues(FIELD_NAMES.price)).toBe("price1");

    act(() => {
      form.setValue(FIELD_NAMES.product, "prod2");
    });
    expect(form.getValues(FIELD_NAMES.price)).toBe("");
  });

  it("keeps price selection when current product selection is pressed again", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        {...createOptionsProps(
          group(
            "plan1",
            product(
              "prod1",
              price("price1"),
              price("price2"),
            ),
            product(
              "prod2",
              price("price3"),
              price("price4"),
            ),
          ),
        )}
      />
    );
    const form = getFormMock();

    act(() => {
      form.setValue(FIELD_NAMES.product, "prod1");
      form.setValue(FIELD_NAMES.price, "price1");
    });
    expect(form.getValues(FIELD_NAMES.price)).toBe("price1");

    act(() => {
      form.setValue(FIELD_NAMES.product, "prod1");
    });
    expect(form.getValues(FIELD_NAMES.price)).toBe("price1");
  });

  it("passes onSubmit to the form", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    expect(formViewMock.mock.lastCall[0].getFormProps()).toEqual(expect.objectContaining({
      onSubmit: expect.any(Function),
    }));
  });

  it("onSubmit calls the passed onSubmit prop function", async () => {
    useForm.mockImplementationOnce(
      createUseFormMock({
        optionReplacements: {
          resolver: undefined, // Remove validation
        }
      })
    );
    const onSubmit = jest.fn();
    render(
      <Logic
        {...MINIMAL_PROPS}
        onSubmit={onSubmit}
      />
    );

    act(() => {
      formViewMock.mock.lastCall[0].getFormProps().onSubmit();
    });

    await waitFor(() => {
      expect(onSubmit).toBeCalledTimes(1);
    });
  });

  it("redirects on succesful submit", async () => {
    const URL = "url";
    useForm.mockImplementationOnce(
      createUseFormMock({
        optionReplacements: {
          resolver: undefined, // Remove validation
        }
      })
    );
    const onSubmit = createUseMutationMock({ status: "success" })(() => ({ url: URL })).mutateAsync;
    render(
      <Logic
        {...MINIMAL_PROPS}
        onSubmit={onSubmit}
      />
    );

    await act(async () => {
      await formViewMock.mock.lastCall[0].getFormProps().onSubmit();
    });

    await waitFor(() => {
      expect(useRouter().push).toBeCalledWith(URL);
    });
  });

  it("does not redirect on failed submit", async () => {
    const URL = "url";
    useForm.mockImplementationOnce(
      createUseFormMock({
        optionReplacements: {
          resolver: undefined, // Remove validation
        }
      })
    );
    const onSubmit = createUseMutationMock({ status: "error" })(() => ({ url: URL })).mutateAsync;
    render(
      <Logic
        {...MINIMAL_PROPS}
        onSubmit={onSubmit}
      />
    );

    await act(async () => {
      await formViewMock.mock.lastCall[0].getFormProps().onSubmit();
    });

    await waitFor(() => {
      expect(useRouter().push).not.toBeCalled();
    });
  });

  it("submit button has a tooltip when form is not valid", () => {
    useForm.mockImplementationOnce(
      createUseFormMock({
        formState: { isValid: false },
      })
    );
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.tooltipText).toMatch(/please select/i);
  });

  it("submit button has no tooltip when form is valid", () => {
    useForm.mockImplementationOnce(
      createUseFormMock({
        formState: { isValid: true },
      })
    );
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.tooltipText).toBeFalsy();
  });

  it("submit button has the expected text when hasCustomerSubscriptions is true", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        hasCustomerSubscriptions
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.submitText).toMatch(/continue to preview/i);
  });

  it("submit button has the expected text when hasCustomerSubscriptions is false", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.submitText).toMatch(/continue to checkout/i);
  });

  it("submit button is type submit when hasCustomerSubscriptions is true", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        hasCustomerSubscriptions
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.type).toBe("button");
  });

  it("submit button is type button when hasCustomerSubscriptions is false", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.type).toBe("submit");
  });

  it("submit button is loading when form is submitting", () => {
    useForm.mockImplementationOnce(
      createUseFormMock({
        formState: { isSubmitting: true },
      })
    );
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.loading).toBe(true);
  });

  it("submit button is not loading when form is not submitting", () => {
    useForm.mockImplementationOnce(
      createUseFormMock({
        formState: { isSubmitting: false },
      })
    );
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.loading).toBe(false);
  });

  it("submit button is disabled when form is invalid", () => {
    useForm.mockImplementationOnce(
      createUseFormMock({
        formState: { isValid: false },
      })
    );
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.disabled).toBe(true);
  });

  it("submit button is disabled when passed isLoading true", () => {
    render(
      <Logic
        {...MINIMAL_PROPS}
        isLoading
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.disabled).toBe(true);
  });

  it("submit button is not disabled when form is valid", () => {
    useForm.mockImplementationOnce(
      createUseFormMock({
        formState: { isValid: true },
      })
    );
    render(
      <Logic
        {...MINIMAL_PROPS}
      />
    );

    const submitProps = formViewMock.mock.lastCall[0].getSubmitProps();
    expect(submitProps.disabled).toBe(false);
  });
});