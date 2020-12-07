import { convertCssForLinaria } from "../convertCssForLinaria";

test("convertCssForLinaria", () => {
  const css = `*,
*::before,
*::after {
  box-sizing: inherit;
}

@-ms-viewport {
  width: device-width;
}

@media print {
  .badge {
    border: 1px solid #000;
  }
}

select.form-control:not([size]):not([multiple]) {
  height: calc(2.25rem + 2px);
}

.alert-dismissible .close {
  position: relative;
  top: -0.75rem;
  right: -1.25rem;
  padding: 0.75rem 1.25rem;
  color: inherit;
}

.alert-link {
  font-weight: bold;
}

.alert-primary {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}

.alert-primary hr {
  border-top-color: #9fcdff;
}

.alert-primary .alert-link {
  color: #002752;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.badge-danger {
  color: #fff;
  background-color: #dc3545;
}

.badge-danger[href]:focus,
.badge-danger[href]:hover {
  color: #fff;
  text-decoration: none;
  background-color: #bd2130;
}

.badge:empty {
  display: none;
}

.blockquote-footer {
  display: block;
  font-size: 80%;
  color: #868e96;
}

.blockquote-footer::before {
  content: "\\2014 \\00A0";
}

.close {
  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: .5;
}


.display-1 {
  font-size: 6rem;
  font-weight: 300;
  line-height: 1.1;
}

.display-2 {
  font-size: 5.5rem;
  font-weight: 300;
  line-height: 1.1;
}

.form-control::placeholder {
  color: #868e96;
  opacity: 1;
}

.group:hover .group-inner {
  content: "group-hover-group-inner";
}
.group .group-inner {
  content: "group-group-inner";
}
`;

  const cssForLinaria = [
    [
      "close",
      new Set(["alertDismissible"]),
      `.\${alertDismissible} & {
  position: relative;
  top: -0.75rem;
  right: -1.25rem;
  padding: 0.75rem 1.25rem;
  color: inherit;
}


  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: .5;


`,
    ],
    [
      "alertDismissible",
      new Set(["close"]),
      `& .\${close} {
  position: relative;
  top: -0.75rem;
  right: -1.25rem;
  padding: 0.75rem 1.25rem;
  color: inherit;
}

`,
    ],
    [
      "alertPrimary",
      new Set(["alertLink"]),
      `
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;


& hr {
  border-top-color: #9fcdff;
}

& .\${alertLink} {
  color: #002752;
}

`,
    ],
    [
      "alertLink",
    new Set(["alertPrimary"]),
  `
  font-weight: bold;


.\${alertPrimary} & {
  color: #002752;
}

`
    ],
    [
      "badge",
      new Set(),
      `@media print {
  & {
    border: 1px solid #000;
  }


}


  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;


&:empty {
  display: none;
}

`,
    ],
    [
      "badgeDanger",
      new Set(),
      `
  color: #fff;
  background-color: #dc3545;


&[href]:focus, &[href]:hover {
  color: #fff;
  text-decoration: none;
  background-color: #bd2130;
}

`,
    ],
    [
      "blockquoteFooter",
      new Set(),
      `
  display: block;
  font-size: 80%;
  color: #868e96;


&::before {
  content: \"\\\\2014 \\\\00A0\";
}

`,
    ],
    [
      "display1",
      new Set(),
      `
  font-size: 6rem;
  font-weight: 300;
  line-height: 1.1;


`,
    ],
    [
      "display2",
      new Set(),
      `
  font-size: 5.5rem;
  font-weight: 300;
  line-height: 1.1;


`,
    ],
    [
      "formControl",
      new Set(),
      `select&:not([size]):not([multiple]) {
  height: calc(2.25rem + 2px);
}

&::placeholder {
  color: #868e96;
  opacity: 1;
}

`,
    ],
    [
      "groupInner",
      new Set(["group"]),
      `.\${group}:hover & {
  content: \"group-hover-group-inner\";
}

.\${group} & {
  content: \"group-group-inner\";
}

`,
    ],
    [
      "group",
      new Set(["groupInner"]),
      `&:hover .\${groupInner} {
  content: \"group-hover-group-inner\";
}

& .\${groupInner} {
  content: \"group-group-inner\";
}

`,
    ],
    [
      "global",
      new Set(),
      `:global() {
*, *::before, *::after {
  box-sizing: inherit;
}



@-ms-viewport {
  width: device-width;
}









































}`,
    ],
  ];

  expect(convertCssForLinaria(css)).toEqual(cssForLinaria);
});
