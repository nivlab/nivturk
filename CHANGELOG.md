# Changelog

## v1.2.7 (2023-07-12)

Authors: Sam Zorowitz ([#127](https://github.com/nivlab/nivturk/pull/127))

- Remove static jQuery file.
- Source jQuery from unpkg.

## v1.2.6 (2023-04-09)

Authors: Sam Zorowitz ([#124](https://github.com/nivlab/nivturk/pull/124))

- Remove deprecated `request.user_agent` calls.
- Return entire `request.user_agent` string.
- Expand list of screened devices (e.g., mobile, tablets, game consoles).

## v1.2.5 (2023-02-28)

Authors: Yongjing Ren, Sam Zorowitz ([#121](https://github.com/nivlab/nivturk/pull/121))

- Consent form updated to reflect latest IRB amendments.
- Minimum hourly wage is now $14 USD/hr (matched to New Jersey).
- Sections on skin conductance added, but commented out by default.
- Future use of data requires no additional consent (as opposed to no additional informed consent).

## v1.2.4 (2022-12-19)

Authors: Yongjing Ren, Sam Zorowitz ([#117](https://github.com/nivlab/nivturk/pull/117))

- Consent form updated to reflect latest IRB amendments.
- Sections on eye-tracking and mood-induction added, but commented out by default.

## v1.2.3 (2022-12-17)

Authors: Sam Zorowitz ([#112](https://github.com/nivlab/nivturk/pull/112))

- Add ability to print/save consent form.
- Update Tacit CSS for dynamic scaling on large monitors.

## v1.2.2 (2022-12-05)

Authors: Sam Zorowitz ([#106](https://github.com/nivlab/nivturk/pull/106))

- Move NivTurk plugins to `experiment.html`.
- Delete `nivturk-plugins.js`.

## v1.2.1 (2022-07-28)

Authors: Sam Zorowitz ([#98](https://github.com/nivlab/nivturk/pull/98))

- Cloudresearch no longer uses dynamic completion codes. Instead, they switched to a static completion code system like Prolific.
- Similar to the Prolific branch, the configuration file (`app.ini`) now accepts real and decoy codes (the latter is currently non-operational, as rejected participants are currently sent to the 1005 error).
- The completion page has been updated to return the completion code specified in the configuration file.

## v1.2.0 (2022-06-02)

Authors: Sam Zorowitz ([#95](https://github.com/nivlab/nivturk/pull/95))

- jsPsych updated from v6.3 to v7.2.1.
- NivTurk now has a toggleable restart mode that, when enabled, allows participants to access the experiment page multiple times without being kicked out. This should make experiment testing easier, and give more flexibility in running experiments online.
- NivTurk will now save incomplete datasets. If a participant attempts to quit an experiment before it is finished, the partial dataset will be saved to a new folder.
- Page redirects have been streamlined.
- Minimized number of "warning" messages that otherwise get written to the metadata log file.
- Improved log file parsing using regular expressions.

## v1.1.5 (2022-03-29)

Authors: Sam Zorowitz ([#87](https://github.com/nivlab/nivturk/pull/87/))

- Require more recent versions of Flask.

## v1.1.4 (2022-03-09)

Authors: Sam Zorowitz

- Language in consent form updated to reflect changes to the online experiments IRB.


## v1.1.3 (2021-05-15)

Authors: Sam Zorowitz ([#70](https://github.com/nivlab/nivturk/pull/70))

- Relative paths added to `experiment.html`. Change may need to be reverted if we adopt [Apache servers](https://github.com/nivlab/nivturk/pull/68).

## v1.1.2 (2021-04-18)

Authors: Sam Zorowitz ([#58](https://github.com/nivlab/nivturk/pull/58), [#61](https://github.com/nivlab/nivturk/pull/61)).

- jsPsych upgraded from v6.2.0 to v6.3.1.
- Added conditional logic for redirecting participants at end of experiment based on performance.

## v1.1.1 (2021-04-15)

Authors: Sam Zorowitz ([#54](https://github.com/nivlab/nivturk/pull/54))

- Fixed CloudResearch iframe code in `complete.html` to reflect latest CloudResearch backend.

## v1.1.0 (2020-12-15)

Authors: Sam Zorowitz ([#49](https://github.com/nivlab/nivturk/pull/49))

- jsPsych upgraded from v6.1.0 to v6.2.0.
- README updated to point to new documentation on Github pages.

## v1.0.0 (2020-08-10)

Authors: Sam Zorowitz, Dan Bennett ([#42](https://github.com/nivlab/nivturk/pull/42))

- First stable version of NivTurk released.
