// [[fill]align][sign][symbol][0][width][,][.precision][type]
var re = /(?:(.)?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?/i;

export default function(specifier) {
  return new FormatSpecifier(specifier);
};

function FormatSpecifier(specifier) {
  var match = re.exec(specifier),
      fill = match[1] || " ",
      align = match[2] || ">",
      sign = match[3] || "-",
      symbol = match[4] || "",
      zero = !!match[5],
      width = match[6] && +match[6],
      comma = !!match[7],
      precision = match[8] && +match[8].slice(1),
      type = match[9] || "";

  // The "n" type is an alias for ",g".
  if (type === "n") comma = true, type = "g";

  // Map invalid types to the default format.
  else if (!/[%bcdefgoprsXx]/.test(type)) type = "";

  // If zero fill is specified, padding goes after sign and before digits.
  if (zero || (fill === "0" && align === "=")) zero = fill = "0", align = "=";

  // Set the default precision if not specified.
  // Note that we don’t clamp the precision here to the allowed range,
  // mainly because of formatPrefix treating "s" precision as fixed.
  if (precision == null) precision = type ? 6 : 12;

  this.fill = fill;
  this.align = align;
  this.sign = sign;
  this.symbol = symbol;
  this.zero = zero;
  this.width = width;
  this.comma = comma;
  this.precision = precision;
  this.type = type;
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width == null ? "" : this.width | 0)
      + (this.comma ? "," : "")
      + (this.precision == null ? "" : "." + (this.precision | 0))
      + this.type;
};
