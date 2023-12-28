import { TankPacket, Variant } from "growtopia.js";
import { BaseServer } from "../structures/BaseServer";
import { Peer } from "../structures/Peer";
import { World } from "../structures/World";
import { DialogBuilder } from "../utils/builders/DialogBuilder";
import { ActionTypes } from "../utils/enums/Tiles";

export function handleWrench(base: BaseServer, tank: TankPacket, peer: Peer, world: World) {
  const tankData = tank.data!;
  const pos = tankData.xPunch! + tankData.yPunch! * world.data.width!;
  const block = world.data.blocks![pos];
  const itemMeta = base.items.metadata.items[block.fg || block.bg!];

  switch (itemMeta.type) {
    case ActionTypes.SIGN: {
      if (world.data.owner) {
        if (world.data.owner.id !== peer.data?.id_user) return;
      }
      const dialog = new DialogBuilder()
        .defaultColor()
        .addLabelWithIcon(`\`wEdit ${itemMeta.name}\`\``, itemMeta.id!, "big")
        .addTextBox("What would you like to write on this sign?")
        .addInputBox("label", "", block.sign?.label, 100)
        .embed("tilex", block.x)
        .embed("tiley", block.y)
        .embed("itemID", itemMeta.id)
        .endDialog("sign_edit", "Cancel", "OK")
        .str();

      peer.send(Variant.from("OnDialogRequest", dialog));
      break;
    }

    case ActionTypes.PORTAL:
    case ActionTypes.DOOR: {
      if (world.data.owner) {
        if (world.data.owner.id !== peer.data?.id_user) return;
      }
      const dialog = new DialogBuilder()
        .defaultColor()
        .addLabelWithIcon(`\`wEdit ${itemMeta.name}\`\``, itemMeta.id!, "big")
        .addInputBox("label", "Label", block.door?.label, 100)
        .addInputBox("target", "Destination", block.door?.destination, 24)
        .addSmallText("Enter a Destination in this format: `2WORLDNAME:ID``")
        .addSmallText(
          "Leave `2WORLDNAME`` blank (:ID) to go to the door with `2ID`` in the `2Current World``."
        )
        .addInputBox("id", "ID", block.door?.id, 11)
        .addSmallText("Set a unique `2ID`` to target this door as a Destination from another!")
        .embed("tilex", block.x)
        .embed("tiley", block.y)
        .embed("itemID", itemMeta.id)
        .endDialog("door_edit", "Cancel", "OK")
        .str();

      peer.send(Variant.from("OnDialogRequest", dialog));
      break;
    }

    case ActionTypes.LOCK: {
      const mLock = base.locks.find((l) => l.id === itemMeta.id);

      if (mLock) {
        if (block.lock?.ownerUserID !== peer.data?.id_user) return;

        const dialog = new DialogBuilder()
          .defaultColor()
          .addLabelWithIcon(`\`wEdit ${itemMeta.name}\`\``, itemMeta.id!, "big")
          .embed("lockID", mLock.id)
          .embed("tilex", block.x)
          .embed("tiley", block.y)
          .addSmallText("Access list:")
          // bikin list user disini nanti
          .addSpacer("small")
          .addTextBox("Currently, you're the only one with access.")
          .raw("add_player_picker|playerNetID|`wAdd``|\n")
          .addCheckbox(
            "allow_break_build",
            "Allow anyone to Build and Break",
            block.lock?.openToPublic ? "selected" : "not_selected"
          )
          .addCheckbox(
            "ignore_empty",
            "Ignore empty air",
            block.lock?.ignoreEmptyAir ? "selected" : "not_selected"
          )
          .addButton("reapply_lock", "`wRe-apply lock``");

        if (itemMeta.id == 4994) {
          dialog
            .addSmallText(
              `This lock allows Building or Breaking.<CR>(ONLY if "Allow anyone to Build or Break" is checked above)!`
            )
            .addSpacer("small")
            .addSmallText("Leaving this box unchecked only allows Breaking.")
            .addCheckbox(
              "build_only",
              "Only Allow Building!",
              block.lock?.onlyAllowBuild ? "selected" : "not_selected"
            )
            .addSmallText(
              "People with lock access can both build and break unless you check below. The lock owner can always build and break."
            )
            .addCheckbox(
              "limit_admin",
              "Admins Are Limited",
              block.lock?.adminLimited ? "selected" : "not_selected"
            );
        }

        dialog.endDialog("area_lock_edit", "Cancel", "OK");

        peer.send(Variant.from("OnDialogRequest", dialog.str()));
      }

      break;
    }
  }
}
