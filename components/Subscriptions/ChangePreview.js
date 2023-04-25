import { groupBy } from "lodash";
import moment from "moment";
import { Fragment } from "react";

import { Box, Divider, List, ListItem, ListItemText, Skeleton, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";

import StackBreak from "@/components/StackBreak";
import { useCreateUpcomingInvoice } from "@/shared/reactQuery/useInvoices";
import { useGetPaymentMethodById } from "@/shared/reactQuery/usePaymentMethods";
import { useGetProducts } from "@/shared/reactQuery/useProducts";


export default function SubscriptionChangePreview({ subscription, lineItems, prorationDate, ...props }) {
  const products = useGetProducts();

  const preview = useCreateUpcomingInvoice({
    subscription: subscription.id,
    subscription_items: lineItems,
    subscription_proration_date: prorationDate,
    expand: "lines.data.price.tiers",
  });

  const paymentMethodId = preview.data?.default_payment_method
    || preview.data?.default_source
    || subscription.default_payment_method
    || subscription.default_source;
  const paymentMethod = useGetPaymentMethodById(
    paymentMethodId,
    { enabled: !!paymentMethodId });


  return (
    <Box {...props}>
      <Typography
        fontSize="2rem"
        color="text.primary"
      >
        {
          preview.isSuccess ? (
            <>
              {preview.data.currency.toUpperCase()}
              ${
                ((moment.unix(preview.data.next_payment_attempt || preview.data.due_date).format("DDD, YYYY") === moment().format("DDD, YYYY"))
                  ? (preview.data?.total || 0) / 100
                  : 0).toFixed(2)
              }

              <Typography
                component="span"
                variant="body1"
                marginLeft={.5}
              >
                due today
              </Typography>
            </>
          ) : <Skeleton />
        }
      </Typography>

      <Typography variant="body1">
        {
          preview.isSuccess
            ? "Then billed monthly based on usage"
            : <Skeleton />
        }
      </Typography>

      <List sx={{ marginTop: 2 }}>
        {
          (preview.isSuccess && products.isSuccess) ? (
            <>
              {
                preview.data.lines.data
                  .filter(item => item.proration === true)
                  .map(item => {
                    const { price } = item;
                    const product = products.data.find(p => p.id === price.product);

                    return (
                      <ListItem
                        key={item.id}
                        disablePadding
                      >
                        <Box flexGrow={1}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="baseline"
                            flexWrap="wrap"
                            columnGap={1}
                          >
                            <Typography
                              variant="body2"
                              color="text.primary"
                              flexGrow={1}
                            >
                              {
                                product
                                  ? product.name
                                  : <Skeleton />
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.primary"
                              align="right"
                              flexGrow={1}
                            >
                              {
                                price.billing_scheme === "per_unit"
                                  ? `$${(price.unit_amount / 100).toFixed(2)} per ${product?.unit_label || "unit"}`
                                  : "Price varies"
                              }
                            </Typography>

                            <StackBreak />

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              flexGrow={1}
                            >
                              Billed monthly
                              {price.recurring?.usage_type !== "licensed" && " based on usage"}
                            </Typography>
                          </Stack>

                          <List disablePadding dense>
                            {
                              price.tiers?.map((tier, i) => (
                                <Fragment key={tier.up_to || "inf"}>
                                  <ListItem disablePadding sx={{ paddingLeft: 2 }}>
                                    <ListItemText
                                      primary={
                                        tier.up_to
                                          ? `First ${tier.up_to} used`
                                          : `${price.tiers[i - 1].up_to + 1}+ used`
                                      }
                                    />

                                    <ListItemText
                                      primary={
                                        `${
                                          price.currency.toUpperCase()
                                        }$${
                                          (tier.unit_amount / 100).toFixed(2)
                                        } per ${
                                          product?.unit_label || "unit"
                                        }`
                                      }
                                      primaryTypographyProps={{ textAlign: "right" }}
                                    />
                                  </ListItem>

                                  {
                                    tier.flat_amount && (
                                      <ListItem disablePadding sx={{ paddingLeft: 4 }}>
                                        <ListItemText
                                          primary="Flat fee"
                                        />

                                        <ListItemText
                                          primary={
                                            `${
                                              price.currency.toUpperCase()
                                            }$${
                                              (tier.flat_amount / 100).toFixed(2)
                                            }`
                                          }
                                          primaryTypographyProps={{ textAlign: "right" }}
                                        />
                                      </ListItem>
                                    )
                                  }
                                </Fragment>
                              ))
                            }
                          </List>
                        </Box>
                      </ListItem>
                    );
                  })
              }

              {
                Object.entries(
                  groupBy(
                    preview.data.lines.data
                      .filter(item => item.proration === false),
                    item => item.price.id
                  )
                ).map(([priceId, items]) => {
                    const { price } = items[0];
                    const product = products.data.find(p => p.id === price.product);

                    return (
                      <ListItem
                        key={priceId}
                        disablePadding
                      >
                        <Box flexGrow={1}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="baseline"
                            flexWrap="wrap"
                            columnGap={1}
                          >
                            <Typography
                              variant="body2"
                              color="text.primary"
                              flexGrow={1}
                            >
                              {
                                product
                                  ? product.name
                                  : <Skeleton />
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.primary"
                              align="right"
                              flexGrow={1}
                            >
                              {
                                price.billing_scheme === "per_unit"
                                  ? `$${(price.unit_amount / 100).toFixed(2)} per ${product?.unit_label || "unit"}`
                                  : "Price varies"
                              }
                            </Typography>

                            <StackBreak />

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              flexGrow={1}
                            >
                              Billed monthly
                              {price.recurring?.usage_type !== "licensed" && " based on usage"}
                            </Typography>
                          </Stack>

                          <List disablePadding dense>
                            {
                              price.tiers?.map((tier, i) => (
                                <Fragment key={tier.up_to || "inf"}>
                                  <ListItem disablePadding sx={{ paddingLeft: 2 }}>
                                    <ListItemText
                                      primary={
                                        tier.up_to
                                          ? `First ${tier.up_to} used`
                                          : `${price.tiers[i - 1].up_to + 1}+ used`
                                      }
                                    />

                                    <ListItemText
                                      primary={
                                        `${
                                          price.currency.toUpperCase()
                                        }$${
                                          (tier.unit_amount / 100).toFixed(2)
                                        } per ${
                                          product?.unit_label || "unit"
                                        }`
                                      }
                                      primaryTypographyProps={{ textAlign: "right" }}
                                    />
                                  </ListItem>

                                  {
                                    tier.flat_amount && (
                                      <ListItem disablePadding sx={{ paddingLeft: 4 }}>
                                        <ListItemText
                                          primary="Flat fee"
                                        />

                                        <ListItemText
                                          primary={
                                            `${
                                              price.currency.toUpperCase()
                                            }$${
                                              (tier.flat_amount / 100).toFixed(2)
                                            }`
                                          }
                                          primaryTypographyProps={{ textAlign: "right" }}
                                        />
                                      </ListItem>
                                    )
                                  }
                                </Fragment>
                              ))
                            }
                          </List>
                        </Box>
                      </ListItem>
                    );
                  })
              }
            </>
          ) : (
            new Array(3).fill(0).map((_item, i) => (
              <ListItem
                key={i}
                disablePadding
              >
                <ListItemText
                  primary={<Skeleton />}
                />
              </ListItem>
            ))
          )
        }
      </List>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        marginY={1}
        columnGap={1}
        fontWeight={600}
      >
        <Typography
          variant="body2"
          fontWeight="inherit"
          color="text.primary"
          flexGrow={1}
        >
          Subtotal
        </Typography>

        <Typography
          variant="body1"
          fontWeight="inherit"
          color="text.primary"
          align="right"
          flexGrow={1}
        >
          {lineItems.some(item => item.price.billing_scheme !== "per_unit") && "Price varies"}
        </Typography>

        <Divider sx={{ flexBasis: "100%", marginY: 1 }} />

        <Typography
          variant="body2"
          fontWeight="inherit"
          color="text.primary"
          flexGrow={1}
        >
          {
            preview.isSuccess
              ? "Total due today"
              : <Skeleton />
          }
        </Typography>

        <Typography
          variant="body1"
          fontWeight="inherit"
          color="text.primary"
          align="right"
          flexGrow={1}
        >
          {
            preview.isSuccess ? (
              `${
                preview.data.currency.toUpperCase()
              }$${
                ((moment.unix(preview.data?.next_payment_attempt || preview.data?.due_date).format("DDD, YYYY") === moment().format("DDD, YYYY"))
                  ? (preview.data?.total || 0) / 100
                  : 0).toFixed(2)
              }`
            ) : <Skeleton />
          }
        </Typography>
      </Stack>

      <Typography
        variant="h6"
        marginTop={4}
      >
        Default payment method
      </Typography>

      <Table size="small" sx={{ marginY: 2 }}>
        <TableBody>
          {
            preview.isSuccess ? (
              <>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">
                      Email
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1">
                      {preview.data?.customer_email}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography variant="body2">
                      Pay with
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {
                      paymentMethod.data.card ? (
                        <Typography variant="body1">
                          <Typography
                            component="span"
                            variant="body1"
                            marginRight={.5}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {paymentMethod.data.card?.brand}
                          </Typography>

                          **** {paymentMethod.data.card?.last4}
                        </Typography>
                      ) : (
                        <Typography variant="body1">
                          None set
                        </Typography>
                      )
                    }
                  </TableCell>
                </TableRow>
              </>
            ) : (
              new Array(2).fill(0).map((_item, i) => (
                <TableRow key={i}>
                  {
                    new Array(2).fill(0).map((_item, j) => (
                      <TableCell key={j}>
                        <Typography variant="body1">
                          <Skeleton />
                        </Typography>
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            )
          }
        </TableBody>
      </Table>
    </Box>
  );
}