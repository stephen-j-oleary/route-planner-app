import { forwardRef } from "react";
import { Controller } from "react-hook-form";

import { Box, CardActionArea, CardContent, Chip, RadioGroup, Skeleton, Stack, Typography } from "@mui/material";

import SelectableCard from "@/components/SelectableCard";
import PlanProductTitle from "@/components/Subscriptions/Form/Product/PlanProductTitle";
import UnstyledRadio from "@/components/UnstyledRadio";


const StyledRadioGroup = forwardRef(
  function StyledRadioGroup(props, ref) {
    return (
      <RadioGroup
        ref={ref}
        {...props}
        sx={{
          display: "grid",
          gap: 2,
          paddingX: 2,
        }}
      />
    );
  }
);

export default function SubscriptionFormProductInput({
  form,
  name,
  products,
  productOptions,
  checkIsProductSubscribed,
}) {
  if (!products.isSuccess) {
    return (
      <StyledRadioGroup>
        {
          new Array(3).fill(0).map((_item, i) => (
            <SelectableCard key={i}>
              <CardContent sx={{ padding: 1.5, height: "100%" }}>
                <Typography variant="body1">
                  <Skeleton width={200} />
                </Typography>
              </CardContent>
              <Box width={0} />
            </SelectableCard>
          ))
        }
      </StyledRadioGroup>
    );
  }

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <StyledRadioGroup {...field}>
          {
            productOptions.map(product => (
              <UnstyledRadio
                key={product.id}
                value={product.id}
                render={(props, radioGroupState) => (
                  <SelectableCard
                    isSelected={radioGroupState.value === props.value}
                  >
                    <CardActionArea
                      sx={{ height: "100%" }}
                      onClick={() => {
                        radioGroupState.onChange({ target: { value: props.value } });
                      }}
                    >
                      <CardContent sx={{ padding: 1.5, height: "100%" }}>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <PlanProductTitle
                            product={product}
                          />

                          {
                            checkIsProductSubscribed(product.id) && (
                              <Chip
                                size="small"
                                label="Current plan"
                              />
                            )
                          }
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </SelectableCard>
                )}
              />
            ))
          }
        </StyledRadioGroup>
      )}
    />
  );
}