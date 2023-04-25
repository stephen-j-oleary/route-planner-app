import { forwardRef } from "react";
import { Controller } from "react-hook-form";

import { CardActionArea, CardContent, List, ListItem, ListItemText, RadioGroup, Skeleton, Typography } from "@mui/material";

import SelectableCard from "@/components/SelectableCard";
import PriceOverview from "@/components/Subscriptions/Form/Price/PriceOverview";
import PriceTitle from "@/components/Subscriptions/Form/Price/PriceTitle";
import UnstyledRadio from "@/components/UnstyledRadio";


const StyledRadioGroup = forwardRef(
  function StyledRadioGroup(props, ref) {
    return (
      <RadioGroup
        ref={ref}
        sx={{
          display: "grid",
          gridAutoColumns: "1fr",
          gridAutoFlow: "column",
          gap: 2,
          ...props.sx,
        }}
        {...props}
      />
    );
  }
);

export default function SubscriptionFormPriceInput({
  form,
  name,
  prices,
  priceOptions,
}) {
  if (!prices.isSuccess) {
    return (
      <StyledRadioGroup>
        <SelectableCard>
          <CardContent>
            <Typography variant="body1">
              <Skeleton width={250} />
            </Typography>

            <List disablePadding dense>
              {
                new Array(3).fill(0).map((_item, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={<Skeleton />}
                    />
                  </ListItem>
                ))
              }
            </List>
          </CardContent>
        </SelectableCard>
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
            priceOptions.map(price => (
              <UnstyledRadio
                key={price.id}
                value={price.id}
                render={(props, radioGroupState) => (
                  <SelectableCard
                    isSelected={radioGroupState.value === props.value}
                  >
                    <CardActionArea
                      onClick={() => {
                        radioGroupState.onChange({ target: { value: props.value } });
                      }}
                    >
                      <CardContent>
                        <PriceTitle price={price} />

                        <PriceOverview price={price} />
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