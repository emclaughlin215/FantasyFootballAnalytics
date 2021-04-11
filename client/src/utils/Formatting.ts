import { Intent } from "@blueprintjs/core";
import { IChipsMetadata } from "../index.d";

export function getChipIntent(chip: IChipsMetadata, isInUse: boolean): Intent {
    if (chip.status_for_entry === 'played') {
      return Intent.DANGER;
    } else if (isInUse) {
      return Intent.PRIMARY;
    } else {
      return Intent.SUCCESS;
    }
  }