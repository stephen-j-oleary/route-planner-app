
import styles from "./styles.module.css";
import classNames from "classnames";
import _ from "lodash";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsState, selectValues } from "../../../redux/slices/routeForm.js";
import { useFormContext } from "react-hook-form";
import useURL from "../../../shared/hooks/useURL.js";

import PlaceholderButton from "react-bootstrap/PlaceholderButton";
import Button from "../../Button";
import Label from "../../Label";
import LoadingPlaceholder from "../../LoadingPlaceholder";
import Select from "../../Select";

export default function Options(props) {
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isResults = useSelector(state => selectIsState(state, "results"));
  const [showOptions, setShowOptions] = useState(false);
  const resultValues = useSelector(selectValues);
  const [url, setUrl] = useURL();
  const { getValues } = useFormContext();
  const stops = getValues("stops");

  const updateQueryValue = useCallback(
    (name) => {
      const value = getValues(name);
      const urlCpy = new URL(url);
      const queryParams = urlCpy.searchParams;
      queryParams.set(name, value);
      setUrl(urlCpy, "replace", { shallow: true });
    },
    [url, setUrl, getValues]
  );

  return (
    <div
      {...props}
      className={classNames(
        styles.container,
        props.className
      )}
    >
      <LoadingPlaceholder
        isLoading={isLoading}
        placeholder={CompPlaceholder}
      >
        <div className={styles.header}>
          <Label
            label={
              !showOptions
                ? ""
                : isResults
                ? "Calculated With Options"
                : "Route Options"
            }
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowOptions(value => !value)}
          >
            {showOptions ? "Hide" : "Options..."}
          </Button>
        </div>

        {showOptions && (
          <div className={styles.body}>
            <div className={styles.inputGroup}>
              <Label
                htmlFor="origin"
                label="Origin"
              />
              {
                isResults
                  ? (
                    <div className="input-like">
                      {_.get(resultValues, `stops.${resultValues.origin}.address`)}
                    </div>
                  )
                  : (
                    <Select
                      name="origin"
                      onChange={_.partial(updateQueryValue, "origin")}
                    >
                      {
                        _.filter(stops, v => !_.isEmpty(v.address)).map((item, i) => (
                          <Select.Option key={i} value={+i} label={item.address} />
                        ))
                      }
                    </Select>
                  )
              }
            </div>
            <div className={styles.inputGroup}>
              <Label
                htmlFor="destination"
                label="Destination"
              />
              {
                isResults
                  ? (
                    <div className="input-like">
                      {_.get(resultValues, `stops.${resultValues.destination}.address`)}
                    </div>
                  )
                  : (
                    <Select
                      name="destination"
                      onChange={_.partial(updateQueryValue, "destination")}
                    >
                      {
                        _.filter(stops, v => !_.isEmpty(v.address)).map((item, i) => (
                          <Select.Option key={i} value={i} label={item.address} />
                        ))
                      }
                    </Select>
                  )
              }
            </div>
          </div>
        )}
      </LoadingPlaceholder>
    </div>
  )
}

const CompPlaceholder = () => (
  <div className={styles.header}>
    <div></div>
    <PlaceholderButton xs={3} size="md" />
  </div>
)
