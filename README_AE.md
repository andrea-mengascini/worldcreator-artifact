# Artifact Evaluation Guide

**Paper:** *Omniscience for the Masses: New Threats in the Metaverse's Democratized World Creation*, ACM CCS 2026 (artifact evaluation submission #81)

- **Zenodo:** [10.5281/zenodo.22817956](https://doi.org/10.5281/zenodo.22817956), version v1.1.1 (concept DOI for all versions: [10.5281/zenodo.22670790](https://doi.org/10.5281/zenodo.22670790))
- **Git mirror:** <https://github.com/andrea-mengascini/worldcreator-artifact>, tag `v1.1.1` (commit `151a4ac480e63218b2ac053e4b66e33c61d563a6`)
- **Website:** <https://andrea-mengascini.github.io/worldcreator-artifact/>
- **Badges requested:** Artifacts Available, Artifacts Evaluated (Functional)
- **License:** CC BY 4.0 (`LICENSE`)

`README.md` gives a general description of the repository. This document is intended for the artifact evaluators. It describes what the artifact contains, which part of the paper each component supports, and what the reviewer should expect to find when opening it. Nothing needs to be installed or executed: a web browser and a spreadsheet application are sufficient. A complete inspection takes about one hour, most of which is spent on the videos.

## Content of the artifact

The artifact consists of data files and video recordings. It covers the following parts of the paper.

| | Content | Paper | Files |
|---|---|---|---|
| A | Recordings of the five omniscience attacks on every platform where they could be mounted: 17 attack/platform pairs, 34 videos (attacker view and victim or bystander view) | §4.1 to §4.5, Table 2, Appendix A | `video/`, `index.html`, `script.js`, `styles.css`, `media/` |
| B | Platform survey: store and search engine queries, 561 candidate applications, 38 shortlisted, 25 platforms coded for their world creation tools | §3.1, §3.2, Table 1, Appendix C (Table 3) | `csv/1_*.csv`, `csv/2_*.csv`, `csv/3_*.csv` |
| C | Literature survey: 60 papers coded by topic and attacker model, and the five attacks selected for re-implementation | §5, §5.1, Fig. 8 | `csv/4_literature_survey.csv` |
| D | Overhead benchmark on the victim client: frame rate, CPU and GPU utilization, three runs | §4.6 | `csv/benchmark/run_{1,2,3}.csv` |
| E | The 3D object used for the unidirectionally transparent (one-way) material | §4.4, Appendix A | `unidirectional_transparent_material.glb` |

**What is not included.** As stated in Appendix B, we do not release the attack scripts or the malicious world files while the underlying issues remain unmitigated on the platforms. The attacks are documented through the synchronized attacker/victim recordings and the captions on the website. The only attack component we release is the one-way material (E), which is a plain 3D object with a specific material setting. The recordings cover the five omniscience attacks of §4 only. The five prior attacks re-implemented in §5 are described in the paper but have no associated videos or data in this artifact.

## Requirements

An ordinary laptop or desktop is sufficient. No VR headset is required, since all videos are 2D screen recordings.

- A web browser (Chrome, Firefox, Safari or Edge) for the website.
- An application that opens CSV files (LibreOffice, Excel, Numbers, or `python3`) for the survey and benchmark data.
- Blender 3.x or later for the `.glb` file. A browser-based glTF viewer such as <https://gltf-viewer.donmccurdy.com/> can be used as an alternative, see Section 5.5.
- Optionally, `python3` to serve the website locally.

## Obtaining the artifact

**Zenodo** (the copy referenced for the Available badge): open <https://doi.org/10.5281/zenodo.22817956>, download `andrea-mengascini/worldcreator-artifact-v1.1.1.zip` and unzip it.

**Git** (identical content):

```bash
git clone https://github.com/andrea-mengascini/worldcreator-artifact.git
cd worldcreator-artifact
git checkout v1.1.1      # commit 151a4ac
```

In both cases, the resulting folder has the following layout.

```
.
├── README.md                              general description of the repository
├── LICENSE                                CC BY 4.0
├── index.html / script.js / styles.css    website with the videos (A)
├── media/                                 platform logos and attacker/victim icons for the website
├── video/                                 34 .mp4 files, <platform>_<attack>_<attacker|victim>.mp4
├── unidirectional_transparent_material.glb   one-way material (E)
└── csv/
    ├── 1_GoogleQuery.csv                  raw query results (B, step 1)
    ├── 1_QuestDB.csv, 1_SteamDB.csv
    ├── 1_quest_query_data_metaverse.csv, 1_quest_query_data_social.csv
    ├── 1_steam_query_data_metaverse.csv, 1_steam_query_data_vr_multiplayer.csv
    ├── 2_App_survey.csv                   merged list, 561 applications (B, step 2)
    ├── 2_selected_app_from_survey.csv     38 applications passing the inclusion criteria
    ├── 3_creation_survey.csv              coding sheet for the world creation tools (B, step 3)
    ├── 3_result_from_the_creation_survey.csv   final table, 25 platforms, Table 3 of the paper
    ├── 4_literature_survey.csv            60 coded papers (C)
    └── benchmark/run_1.csv, run_2.csv, run_3.csv   overhead measurements (D)
```

## Quick start

1. Open the website at <https://andrea-mengascini.github.io/worldcreator-artifact/>. GitHub Pages may take a moment to load the first time. Alternatively, the unpacked folder can be served locally with

   ```bash
   python3 -m http.server 8000
   ```

   and opened at <http://localhost:8000/>. Opening `index.html` directly from the file system also works in most browsers; a local server only avoids autoplay restrictions.
2. Select a platform from the cards at the top of the page (Roblox, VRChat, Spatial, Horizon Worlds, FrameVR).
3. Play an attack. The victim (or bystander) video is on the left and the attacker video on the right. Pressing play on either one starts both: `script.js` keeps them synchronized, and the captions below describe what happens at each timestamp. The ring around each video is a volume meter, which shows when the attacker can hear the victim.

The reviewer should find five attacks for Roblox and VRChat, three for Spatial, two for Horizon Worlds, and two for FrameVR, 17 in total, each with a pair of synchronized recordings.

## Correspondence between the paper and the artifact

The five parts below are independent of each other and can be examined in any order.

### 5.1 Attack recordings (§4, Table 2)

The five platforms on the website cover all the attacks. Each attack shows the victim's video on the left and the attacker's video on the right, synchronized, with captions underneath. The same files are available in `video/`, named `<platform>_<attack>_<attacker|victim>.mp4`, where `conv` stands for Conversation Hijacking. For that attack, the "victim" video is the bystander who is deceived.

The pairs on the website correspond exactly to the filled cells of the omniscience part of Table 2:

- Roblox and VRChat: all five attacks (Parabolic Microphone, Control Room, Astral Projection, Unidirectional Material, Conversation Hijacking).
- Spatial: Control Room, Astral Projection, Unidirectional Material.
- Horizon Worlds and FrameVR: Astral Projection and Unidirectional Material.

Each attack should exhibit the following behavior.

- Parabolic Microphone (§4.1): the attacker continues to hear the victim from a distance at which the voice should no longer be audible. The volume meter on the attacker's side rises again when the victim approaches the microphone object.
- Control Room (§4.2) and Astral Projection (§4.3): the attacker observes the victim through a camera feed or a detached camera, while the victim sees an ordinary room with no camera and no indicator.
- Unidirectional Material (§4.4): the victim sees a solid wall or floor; the attacker sees through it.
- Conversation Hijacking (§4.5): the bystander continues to hear "the victim" while the real victim is muted and the attacker speaks in their place.

In all recordings, the victim's side shows no visual or audio trace of the attack, which is the stealthiness claim of §4.6.

### 5.2 Platform survey (§3, Table 1 and Table 3)

`csv/3_result_from_the_creation_survey.csv` contains one row per platform, 25 in total, matching the platforms of Table 3. The columns map to Table 3 as follows.

| Table 3 | CSV column |
|---|---|
| Game | `Game Engine + SDK` |
| In-App | `In-app` |
| Cust. | `Custom` |
| No-code | `visual scripting, no-code, block-building` |
| Code | `full code` |
| Lang | `Lang` |

For the 11 platforms listed as discarded below Table 3, the reason is given in `Additional Comments for removal` (paid, shut down, no scripting, and so on). The five platforms of Table 1 are among these rows. Frame has `0 / 1` in `Custom` and `full code` (and `010 / 110 / 1` in `CODE`) because it lost its custom JavaScript editor after our experiments, see the footnote of Table 3. The columns `Editor - Description`, `Scripting - Description`, `Hosting - Description` and `Review - Description` contain the notes taken during coding.

The remaining files document the steps that led to the 25 platforms.

1. `csv/1_*.csv`: raw results of the queries on Google, Steam (store and SteamDB), and the Meta Quest store (store and QuestDB).
2. `csv/2_App_survey.csv`: the merged list of 561 applications. The columns `Accessible`, `Multiplayer`, `Social` and `Creator` are the inclusion criteria, and `Z-score` is the popularity rank. `csv/2_selected_app_from_survey.csv` lists the 38 applications that pass all criteria, ranked; the first 25 are the platforms of Table 3.
3. `csv/3_creation_survey.csv`: the working sheet of the coding. Only the 38 shortlisted applications have the coding columns filled (from `Who` onward, where `Who` indicates the coder who handled the platform). The other rows contain application metadata only.

### 5.3 Literature survey (§5, Fig. 8)

`csv/4_literature_survey.csv` has one row per paper. The 60 rows are the 60 surveyed papers; the 32 rows with `Attack Group` filled in are the papers proposing an attack; and the seven categories of §5 are the labels used in `Attack Group` (a paper may carry more than one). `Selected Attack` names the representative attack of each paper, some of them (keylogging, fake login, ad fraud) fall in the categories excluded in §5. The last column, `Re-implemented in §5.1`, marks the five papers behind the attacks of Table 2 and Fig. 8 (User Re-identification, Social Logging, User DoS, FP with Motion Data, Human Joystick), so you can go from the citation in the table to the row. `Attacker` is the free text on the attacker, `Attacker-code` its code, `Attacker app/user` says if the attacker is an application on the system or another user (empty when it does not apply), and `Attacker app/user (final)` is the resolved value for the 32 attack papers.

### 5.4 Overhead benchmark (§4.6)

The three files in `csv/benchmark/` each contain one block per platform and one row per attack, with the measurements without the attack, with the attack, and their difference as a fraction and as a percentage. The last line of each file is the average over all attacks and platforms of that run.

| | avg. fps | CPU | GPU |
|---|---|---|---|
| `run_1.csv` | −1.01 % | +9.47 % | −1.52 % |
| `run_2.csv` | +0.38 % | +9.58 % | +0.09 % |
| `run_3.csv` | +0.42 % | +5.41 % | +2.10 % |

Only `run_1.csv` covers all five platforms: Spatial stopped hosting custom 3D worlds after the first run and is therefore absent from runs 2 and 3. The figures reported in the manuscript are those of run 1, the only run with all the platforms.

### 5.5 One-way material (§4.4)

`unidirectional_transparent_material.glb` is the object used to build the one-way walls and floors on all platforms. It is a single plane created in Blender with backface culling enabled in the material settings, so that it is rendered from one side only. The effect can be seen in a browser-based glTF viewer such as <https://gltf-viewer.donmccurdy.com/>; however, we recommend opening the file in Blender, where the material settings themselves are visible and the behavior can be verified with certainty. In either tool, orbiting around the plane shows it as visible from one side and invisible from the other, which is what the Unidirectional Material recordings demonstrate.

## Notes

**Platform changes.** Spatial stopped hosting custom 3D worlds during the study (hence the single benchmark run including it), and FrameVR later removed its JavaScript custom editor (see the footnote of Table 3). The recordings show the platforms as they were at the time of the experiments.

**Badges.** Reproducing the attacks live requires creator accounts on the platforms and the world files, which we do not release for the reasons given in Appendix B. For this reason, we request the Available and Functional badges, and not Results Reproduced.

**Ethics.** All recordings were made in private or unlisted instances using our own test accounts. No other users appear in them (Appendix B).
