# Metaverse Attack Videos - Paper Submission Materials

This anonymous repository contains supplemental video material for the omniscience attacks introduced in our paper **Omniscience for the Masses: New Threats in the Metaverse’s Democratized World Creation**, currently under review at CCS 2026.

## Anonymous Website (Recommended)

The easiest and most effective way to explore our supplementary materials is via the anonymous website linked here: https://anonymous.4open.science/w/artifacts-worldcreator/. The same link is available via the **"Website"** button in the top-right corner of this page.

The site is fully anonymous and hosted on `4open.science` specifically for artifact evaluation. We provide the link here solely for your convenience.

### How to Use the Website

1. Select a platform at the top of the page to explore the associated attack scenarios.
2. For each attack, you can:
   * Watch videos from both Attacker and Victim/Bystander perspectives.
   * Read detailed explanations alongside each video.

## Repository Content

This repository contains the source code of the website and the application-survey, the 3D one-way material file, coding of the  analysis, and the notes on how coding conflicts were resolved.

### Website Source Code
The main file  for the website is `index.html`, which links to a collection of videos in the `video/` directory demonstrating world creator attacks in metaverse environments. Each video shows the attack from one perspective:

- **Victim** (or Bystander): The viewpoint of the user being targeted within the metaverse.
- **Attacker**: The viewpoint of the adversary targeting the victim.

The victim and attacker videos are synchronized and enriched with detailed explanations via JavaScript in `index.html`. For this reason, we recommend exploring this supplementary material via the website here: https://anonymous.4open.science/w/worldcreator-artifact/.

Additionally, the one-way 3D Material file `unidirectional_transparent_material.glb` is included.

### Survey Data
The `csv/` directory contains survey data collected from metaverse applications, along with coding files.

The directory includes the following files:
- Query results from stores and search engines:
`1_GoogleQuery.csv`, `1_quest_query_data_metaverse.csv`, `1_quest_query_data_social.csv`, `1_QuestDB.csv`, `1_SteamDB.csv`, `1_steam_query_data_metaverse.csv`, `1_steam_query_data_vr_multiplayer.csv` ;
- Application survey data: `2_App_survey.csv` (full app survey dataset) and `2_selected_app_from_survey.csv`.
- World creation and editor tools surveys: `3_creation_survey.csv` (world creation survey data) and `3_result_from_the_creation_survey.csv` (platform editor tools survey data).
- Literature survey coding: `4_literature_survey.csv`, containing the coding of identified attacks from the literature.

### Attack Overhead Benchmark
The `csv/benchmark` directory contains victim-client benchmark data comparing performance with and without the attack.
For each attack and platform, we recorded the victim client’s average frame rate, CPU utilization, and GPU utilization.
Each measurement was repeated three times, except for Spatial (included only in `run_1.csv`), which discontinued 3D
World hosting during the benchmark process.