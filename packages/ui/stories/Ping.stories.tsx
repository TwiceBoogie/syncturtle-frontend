import * as React from "react";

import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta = { title: "Ping/Minimal", parameters: { layout: "centered" } };
export default meta;
export const Default: StoryObj = { render: () => <div>ping</div> };
