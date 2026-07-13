import type { ComponentType } from "react";
import { EmiTool } from "./emi/Tool";
import { AreaTool } from "./area/Tool";
import { StampDutyTool } from "./stamp-duty/Tool";

// Maps a tool slug to its interactive client component. This is the ONE place a
// new tool's UI is wired in (alongside its registry entry + module). The dynamic
// route resolves the component from here.

export const toolComponents: Record<string, ComponentType> = {
  emi: EmiTool,
  "area-converter": AreaTool,
  "stamp-duty-rj": StampDutyTool,
};
