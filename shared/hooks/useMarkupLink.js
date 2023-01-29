import { isUndefined, has, pick } from "lodash";
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
            .filter(v => !isUndefined(v) && has(v, "type"))
            .map(v => pick(v, ["id", "icon", "label", "title", "type", "position"]))
        )
      );
    },
    [values, dispatch]
  );
}
