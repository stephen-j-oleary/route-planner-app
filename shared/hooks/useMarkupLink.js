import _ from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMarkup } from "../../redux/slices/map";

export default function useMarkupLink(values) {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(
        setMarkup(
          values
            .filter(v => !_.isUndefined(v) && _.has(v, "type"))
            .map(v => _.pick(v, ["id", "icon", "label", "title", "type", "position"]))
        )
      );
    },
    [values, dispatch]
  );
}
