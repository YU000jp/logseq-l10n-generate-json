# logseq-l10n-create-json

Extract '`t("string")`' from the scripts in the folder and create one JSON file.

## Dependencies

- **[logseq-l10n](https://github.com/sethyuan/logseq-l10n)**: L10N framework for Logseq plugins

## Install

1. Clone this repo. Run command '`pnpm install`'.
1. Edit "config.js".

## Usage

1. **Enclose all strings to be translated in the scripts with "t("string")".**.
1. Enter "targetFolderPath" in "config.js".
1. Run “`node index.cjs`” command in terminal.
1. One File will be created in the target folder.
   > If a file with the same name exists, it will not be updated.

```TypeScript
import { setup as l10nSetup , t } from "logseq-l10n"

const main = async () => {
    //await l10nSetup({builtinTranslations: { }})


    // Use `t` for text with translations.

    console.log(t("Hello world!"))

    logseq.UI.showMsg(t("Success"), "success")


}
```