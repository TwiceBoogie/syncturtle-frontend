import { FC } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { Link } from "@heroui/link";
import { useWorkspace } from "@/hooks/store";

import { WEB_BASE_URL } from "@/helpers/common.helper";
import { Button } from "@heroui/react";
import { ExternalLink, Info } from "lucide-react";

interface IWorkspaceListItemProps {
  workspaceId: string;
}

export const WorkspaceListItem: FC<IWorkspaceListItemProps> = (props) => {
  const { workspaceId } = props;
  // store hooks
  const { getWorkspaceById } = useWorkspace();
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) {
    return null;
  }
  return (
    <Card
      as={Link}
      isExternal
      href={`${WEB_BASE_URL}/${encodeURIComponent(workspace.slug)}`}
      className="group flex items-center justify-between p-4 gap-2.5 truncate"
    >
      <CardBody className="flex flex-row items-center justify-between">
        <div className="flex items-start gap-4">
          <span
            className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center p-2 mt-1 text-xs uppercase ${
              !workspace.logoUrl && "rounded bg-custom-primary-100 text-white"
            }`}
          >
            {workspace?.name?.[0] ?? "..."}
          </span>
          <div className="flex flex-col items-start gap-1">
            <div className="flex flex-wrap w-full items-center gap-2.5">
              <h3 className="text-base font-medium capitalize">{workspace.name}</h3>/
              <Tooltip content="The unique URL of your workspace">
                <h4 className="text-sm text-custom-text-300">[{workspace.slug}]</h4>
              </Tooltip>
            </div>
            {workspace.owner.email && (
              <div className="flex items-center gap-1 text-xs">
                <h3 className="text-custom-text-200 font-medium">Owned by:</h3>
                <h3 className="text-custom-text-300">{workspace.owner.email}</h3>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-xs">
              {workspace.totalMembers !== null && (
                <>
                  <span className="flex items-center gap-1">
                    <h3 className="text-custom-text-200 font-medium">Total members:</h3>
                    <h4 className="text-custom-text-300">{workspace.totalMembers}</h4>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div>
          <ExternalLink size={20} className="text-custom-text-400 group-hover:text-custom-text-200" />
        </div>
      </CardBody>
    </Card>
  );
};
