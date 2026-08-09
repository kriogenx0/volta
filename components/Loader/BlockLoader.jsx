import times from "lodash/times";

import "./BlockLoader.scss";

export default function BlockLoader() {
  return (
    <div className="block_loader">
      {times(9, (k) => (
        <div className="block" />
      ))}
    </div>
  );
}