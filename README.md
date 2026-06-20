# Bar Storage

Bar Storage is an Alt1 app for saving, browsing, importing, and exporting RuneScape 3 action bars.

It is designed for simple visual bar storage: each entry has a name tag, combat style, mode, weapon type, source note, and a 14-slot action bar layout.

## Install

Install it in Alt1 with:

```text
alt1://addapp/https://TrulyBoredAdventure.github.io/Bar-Storage/appconfig.json
```

## What it does

- Browse reference bars for PvM, bosses, Slayer, Revolution, Revolution++, and manual play
- View simple 14-slot visual action bars
- Filter by category, combat style, combat mode, and weapon type
- Search by boss, Slayer monster, ability, tag, or source
- Create your own named action bars
- Edit, duplicate, and delete personal bars
- Export your personal bars as JSON
- Import shared bars from another player
- Keep reference bars and personal bars separate

## Reference bars

The app includes a larger starter library of compact reference bars inspired by current PvME and RuneScape Wiki action bar categories.

Reference bars include a source label in the details view. These are meant to be editable baselines, not guaranteed best-in-slot rotations.

RuneScape combat changes over time. Always check the linked source and adjust for your unlocks, gear, relics, prayers, aura, familiar, perks, and the encounter.

## Creating a bar

Select **New bar**, then fill in:

- Name
- Category
- Combat style
- Mode
- Weapon type
- Target
- Tags
- Abilities
- Unlock requirements
- Notes

Bars are limited to 14 slots, matching the maximum action bar length used by the app.

## Combat style and weapon filtering

When you choose a combat style, the weapon dropdown only shows weapon types that fit that style.

Examples:

- Necromancy shows death guard, lantern, and Necromancy options
- Magic shows staff and dual-wield magic options
- Ranged shows bow, crossbow, dual-wield ranged, and thrown options
- Melee shows 2H, dual-wield, halberd-range, and shield options

## Sharing bars

Use **Export** to download your personal bars as a JSON file.

Another player can use **Import** to load that file into their own Bar Storage app.

Imported bars are saved as personal bars and can be edited or deleted without changing the built-in reference library.

## Data storage

Personal bars are saved locally in the Alt1/browser storage on your computer.

Export your bars before clearing browser data, changing devices, or reinstalling.

## Files

```text
appconfig.json   Alt1 app manifest
index.html       Main app screen
data.js          Built-in reference bars
app.js           App behavior and local storage
styles.css       App styling
icon.svg         App icon
```
