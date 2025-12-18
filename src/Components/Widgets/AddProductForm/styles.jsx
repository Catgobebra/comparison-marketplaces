export const fab = {
  height: "40px !important",
  width: "50px !important",
  fontSize: "7px",
  marginLeft: "15px !important",
};

export const inputUrl = {
  /* height: '38px !important',
    width: '295px !important', */
  width: "100%",
  fontSize: "7px",
};

export const inputAdornement = {
  margin: 0,
  padding: 0,
  height: "38px",
  fontSize: "10px",
  maxHeight: "none",
  alignSelf: "stretch",
  display: "flex",
  alignItems: "stretch",
  "& .MuiButton-root": {
    borderRadius: "0 10px 10px 0",
    margin: 0,
  },
};

export const inputButton = {
    height: "100%",
    width: "51px",
    fontSize: "10px",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
    mx: "-1px",
    mr: "-9px",
}

export const outlineInput = {
    padding: 0,
    height: "38px",
    "& .MuiOutlinedInput-input": {
        padding: "12px 14px",
        borderRadius: "10px 0 0 10px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderRight: "divider",
        borderRadius: "10px",
    },
    "&::placeholder": {
        fontSize: "8px",
    },
    "& .MuiOutlinedInput-root": {
        padding: 0,
        display: "flex",
        alignItems: "stretch",
        borderRadius: "10px",
    },
}