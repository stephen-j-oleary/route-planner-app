import { forwardRef } from "react";
import { Controller } from "react-hook-form";

import { Box, CardActionArea, CardContent, RadioGroup, Skeleton, Typography } from "@mui/material";

import SelectableCard from "@/components/SelectableCard";
import PlanGroupTitle from "@/components/Subscriptions/Form/Product/PlanGroupTitle";
import UnstyledRadio from "@/components/UnstyledRadio";


const StyledRadioGroup = forwardRef(
  function StyledRadioGroup(props, ref) {
    return (
      <RadioGroup
        ref={ref}
        {...props}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          ...props.sx,
        }}
      />
    );
  }
);


export default function SubscriptionFormGroupInput({
  form,
  name,
  products,
  groupOptions,
}) {
  if (!products.isSuccess) {
    return (
      <StyledRadioGroup>
        {
          new Array(3).fill(0).map((_item, i) => (
            <SelectableCard key={i}>
              <CardContent sx={{ height: "100%" }}>
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
            Object.entries(groupOptions).map(([name, value]) => (
              <UnstyledRadio
                key={name}
                value={name}
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
                      <CardContent sx={{ height: "100%" }}>
                        <PlanGroupTitle
                          products={value}
                        />
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