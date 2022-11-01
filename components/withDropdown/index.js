
import styles from "./styles.module.css";
import _ from "lodash";
import { forwardRef, useState } from "react";
import { usePopper } from "react-popper";
import mergeEvents from "../../shared/hooks/mergeEvents.js";

export default function withDropdown(Component, options = {}) {
  return forwardRef(function ComponentWithDropdown({ onChange, onFocus, onBlur, ...props } = {}, forwardedRef) {
    const [showPopper, setShowPopper] = useState(false);
    const [referenceEl, setReferenceEl] = useState(null);
    const [popperEl, setPopperEl] = useState(null);
    const popper = usePopper(referenceEl, popperEl, options);

    const [selectedItem, setSelectedItem] = useState(null);
    const [data, setData] = useState([]);

    const updatePopper = () => {
      if (_.isFunction(popper?.update)) popper.update();
    };

    const handleChange = () => setSelectedItem(null);
    const handleFocus = () => {
      setShowPopper(true);
      updatePopper();
    };
    const handleBlur = () => {
      _.delay(setShowPopper, 250, false);
      updatePopper();
    };
    const handleSelect = item => {
      setSelectedItem(item);
    }

    return (
      <>
        <Component
          selection={selectedItem}
          setData={setData}
          ref={node => {
            setReferenceEl(node);
            if (forwardedRef) _.isFunction(forwardedRef) ? forwardedRef(node) : forwardedRef.current = node;
          }}
          onChange={mergeEvents(onChange, handleChange)}
          onFocus={mergeEvents(onFocus, handleFocus)}
          onBlur={mergeEvents(onBlur, handleBlur)}
          {...props}
        />

        <div
          data-show={showPopper}
          ref={setPopperEl}
          className={styles.dropdown}
          style={popper.styles.popper}
          {...popper.attributes.popper}
        >
          {
            data.length ? (
              data.map(item => (
                <div
                  key={item.title}
                  className={styles.item}
                  onClick={() => handleSelect(item)}
                  data-clickable={true}
                >
                  <p className={styles.title}>{_.get(item, "title", item)}</p>
                  {!_.isUndefined(item.subtitle) && <p className={styles.subtitle}>{item.subtitle}</p>}
                </div>
              ))
            ) : (
              <div className={styles.item}>
                No results
              </div>
            )
          }
        </div>
      </>
    )
  })
}
