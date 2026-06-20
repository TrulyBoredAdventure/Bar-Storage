# Bar Storage

Bar Storage is an Alt1 app for browsing RuneScape 3 action-bar references and saving your own 14-slot bars.

## Install

Install it in Alt1 with:

```text
alt1://addapp/https://TrulyBoredAdventure.github.io/Bar-Storage/appconfig.json
```

## Library

The Library contains visual action bars with their name, combat style, combat mode, weapon type, source, notes, and unlock reminders.

Use the filters to narrow the list by:

- PvME, RuneScape Wiki, or personal bars
- Boss, Slayer, recommended, or user category
- Combat style
- Revolution, Revolution++, or full manual
- Compatible weapon type

Selecting a combat style limits weapon choices to weapons that can be used with that style.

Every saved bar has a maximum of 14 slots. Blank slots are supported and remain in their original position.

## Active Bar Scanner

The Scanner can quickly create a personal preset from the action bar currently shown in RuneScape.

1. Open the **Scanner** tab.
2. Keep the standard horizontal main action bar visible at 100% interface scaling.
3. Select **Scan active bar** inside Alt1.
4. Review the detected abilities in slots 1 through 14.
5. Correct any uncertain result, enter a name, and select **Save scanned bar**.

A screenshot can also be pasted with `Ctrl+V` or opened from the Scanner tab.

The scanner identifies the active main bar by the health, adrenaline, prayer, and summoning displays above it. Extra action bars visible elsewhere on the screen are ignored.

Ability order is preserved exactly from left to right, including empty slots. Corrected scanner results are learned locally to improve future matching on the same computer.

### Scanner permissions

Alt1 must be allowed to read RuneScape screen pixels for live scanning. When that permission is unavailable, paste or open a screenshot instead.

Remote ability artwork is used as the initial matching library. An internet connection may be needed the first time those icon templates load.

## Personal bars

Select **New bar** to create a preset manually. Personal bars can be:

- Named and tagged
- Edited or deleted
- Duplicated from a reference bar
- Backed up with Export
- Restored or shared with Import

Personal presets and learned scanner corrections are stored locally. Bar Storage does not upload them.

## Credits

Open the **Credits** tab in the app for acknowledgements to TrulyBoredAdventure, RuneApps/Alt1, PvME, the RuneScape Wiki, and Jagex.

## Reference note

Reference bars are starting points rather than guaranteed best-in-slot setups. Combat updates, ability unlocks, equipment, perks, and encounter requirements can change the ideal order.
