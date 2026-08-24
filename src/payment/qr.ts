// SPDX-License-Identifier: MIT
import { renderSVG } from "uqr";

/** EPC069-12 requires QR error correction level M. */
export function girocodeSvg(payload: string): string {
  return renderSVG(payload, {
    ecc: "M",
    border: 2,
    pixelSize: 4,
    whiteColor: "#f4efe6",
    blackColor: "#2b241c",
  });
}
