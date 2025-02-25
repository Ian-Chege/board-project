"use client"

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu"
import { Link2, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { useRenameModal } from "@/store/use-rename-modal"
import { ConfirmModal } from "./confirm-modal"
import { Button } from "./ui/button"

interface ActionProps {
  children: React.ReactNode
  side?: DropdownMenuContentProps["side"]
  sideOffset?: DropdownMenuContentProps["sideOffset"]
  id: string
  title: string
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionProps) => {
  const router = useRouter()
  const { onOpen } = useRenameModal()
  const { mutate, pending } = useApiMutation(api.workspace.remove)
  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/workspace/${id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"))
  }
  const onDelete = () => {
    mutate({ id })
      .then(() => toast.success("Workspace deleted"))
      .catch(() => toast.error("Failed to delete workspace"))
    router.push("/dashboard")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" />
          Copy workspace link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onOpen(id, title)}
          className="p-3 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <ConfirmModal
          header="Delete workspace?"
          description="This will delete the workspace and all of its contents."
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
