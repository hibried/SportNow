// useNumberInputHandlers.js
export function useNumberInputHandlers(setValue) {
  const onChange = (e) => {
    let val = e.target.value;

    // 1) keep digits only (cleans pasted e, +, -, ., spaces, etc.)
    val = val.replace(/\D+/g, "");

    // 2) compress leading zeros
    //    - "0"      -> "0"   (allowed)
    //    - "00"     -> "0"
    //    - "000123" -> "123"
    if (val.length > 1) {
      val = val.replace(/^0+/, "");
      if (val === "") val = "0"; // all zeros -> single "0"
    }

    setValue(val);
  };

  const onKeyDown = (e) => {
    // block scientific/negative/decimal typing
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  return { onChange, onKeyDown };
}
