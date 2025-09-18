import { fn } from "storybook/test";
import { Input } from "../src";
import { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const FormDecorator: Decorator = (Story, ctx) => (
  <div className="flex h-full w-full items-center justify-between">
    <div className="rounded-large bg-slate-800 shadow-small flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg">Sign in to your account</h1>
        <p className="text-sm">to continue</p>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <Story args={{ id: "email", type: "email", placeholder: "name@company.com", ...ctx.args }} />
      </form>
    </div>
  </div>
);

const meta = {
  title: "Form/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },

  args: { onChange: fn() },
  decorators: [FormDecorator],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    mode: "primary",
  },
};
