# Changelog

## v1.2.3 (2022-12-19)

Authors: Yongjing Ren, Sam Zorowitz ([#116](https://github.com/nivlab/nivturk/pull/116))

- Consent form updated to reflect latest IRB amendments.

## v1.2.2 (2022-12-15)

Authors: Jamie Chiu, Sam Zorowitz ([#109](https://github.com/nivlab/nivturk/pull/109))

- Add ability to print/save consent form.
- Update Tacit CSS for dynamic scaling on large monitors.

## v1.2.1 (2022-12-05)

Authors: Sam Zorowitz ([#106](https://github.com/nivlab/nivturk/pull/106))

- Move NivTurk plugins to `experiment.html`.
- Delete `nivturk-plugins.js`.

## v1.2.0 (2022-06-02)

Authors: Sam Zorowitz ([#94](https://github.com/nivlab/nivturk/pull/94))

- jsPsych updated from v6.3 to v7.2.1.
- NivTurk now has a toggleable restart mode that, when enabled, allows participants to access the experiment page multiple times without being kicked out. This should make experiment testing easier, and give more flexibility in running experiments online.
- NivTurk will now save incomplete datasets. If a participant attempts to quit an experiment before it is finished, the partial dataset will be saved to a new folder.
- Page redirects have been streamlined.
- Minimized number of "warning" messages that otherwise get written to the metadata log file.
- Improved log file parsing using regular expressions.

## v1.1.5 (2022-03-29)

Authors: Sam Zorowitz ([#86](https://github.com/nivlab/nivturk/pull/86/))

- Require more recent versions of Flask.

## v1.1.4 (2022-03-09)

Authors: Sam Zorowitz

- Language in consent form updated to reflect changes to the online experiments IRB.

## v1.1.3 (2021-05-24)

Authors: Dan Bennett ([#71](https://github.com/nivlab/nivturk/pull/71))

- MTurk language (e.g. "HIT") removed from alert page of Prolific branch.

## v1.1.2 (2021-05-15)

Authors: Sam Zorowitz ([#69](https://github.com/nivlab/nivturk/pull/69))

- Relative paths added to `experiment.html`. Change may need to be reverted if we adopt [Apache servers](https://github.com/nivlab/nivturk/pull/68).

## v1.1.1 (2021-04-18)

Authors: Sam Zorowitz ([#57](https://github.com/nivlab/nivturk/pull/57), [#60](https://github.com/nivlab/nivturk/pull/60)).

- jsPsych upgraded from v6.2.0 to v6.3.1.
- Added conditional logic for redirecting participants at end of experiment based on performance.

## v1.1.0 (2020-12-15)

Authors: Sam Zorowitz ([#48](https://github.com/nivlab/nivturk/pull/48))

- jsPsych upgraded from v6.1.0 to v6.2.0.
- README updated to point to new documentation on Github pages.

## v1.0.0 (2020-08-10)

Authors: Sam Zorowitz, Dan Bennett ([#41](https://github.com/nivlab/nivturk/pull/41))

- First stable version of NivTurk released.
