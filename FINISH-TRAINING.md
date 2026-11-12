# Retraining the model

The deployed model recognises all twelve plants in the library: the ten trees,
plus vinca and papaya. It was retrained on 2026-11-12.

## What the model is trained on

- `dataset/inaturalist/<class>/`: openly licensed iNaturalist photos, credited in
  `dataset/inaturalist/CREDITS.json`. There are about 400 per class, and 800 each
  for Sidr and Samar, the pair the old model confused most.
- `dataset/custom/<class>/`: the team's own kiosk photos, weighted 3×. These are
  kept out of git because they show people.
- `dataset/kiosk-test/<class>/`: kiosk photos that are **never** trained on. They
  are the honest test of the kiosk itself.

## Add more of your own photos

This is the single most effective thing you can do. Photograph the plant the way
the kiosk will see it, then drop the photos into `dataset/custom/<class>/`. Use
the class keys from `tools/species.mjs`, for example `sidr`, `samar`, `ghaf`,
`vinca` or `papaya`. Keep one or two of each in `dataset/kiosk-test/<class>/`.

```bash
npm run fetch     # only needed on a fresh clone; resumable
npm run train     # embeds every photo on parallel workers, then trains the head
node tools/kiosk-eval.mjs   # checks the held-out kiosk photos, using the same three views as the app
npm run sw        # re-hash the offline cache so returning visitors get the new model
```

## Reading the result

`npm run train` prints two confusion matrices: one for the field photos, and one
for the same leaves cut out and laid on plain paper. The validation split is by
iNaturalist *observation*, so two photos of one tree never sit on both sides.
That makes the figures lower, and honest.

At the last training run, Ghaf was the weakest class. It has the fewest
reference photos (365) and a true lookalike (Mesquite). Kiosk photos of Ghaf
would help it more than anything else.
