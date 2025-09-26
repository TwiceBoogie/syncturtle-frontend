"use client";

import { SITE_TITLE } from "@syncturtle/constants";
import { useEffect } from "react";

interface IUseHeadParams {
  title?: string;
}

const useHead = ({ title }: IUseHeadParams) => {
  useEffect(() => {
    if (title) {
      document.title = title ?? SITE_TITLE;
    }
  }, [title]);
};

type PageHeadTitleProps = {
  title?: string;
  description?: string;
};

export const PageHead: React.FC<PageHeadTitleProps> = (props) => {
  const { title } = props;

  useHead({ title });

  return null;
};
