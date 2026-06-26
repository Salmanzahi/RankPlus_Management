![](https://media.forgecdn.net/attachments/description/null/description_4f342117-2035-45a9-877f-b2d4203ad976.png)

# RANK+ Management

This is an addon for Minecraft Bedrock that dynamically managed players ranks. It contains CRUD (Create, Read, Update, and Delete ) option for ranks via form GUI . So the host could easily managed players rank without touching the scripts.

To make this addon more useful, this addon also feature a nickname changer.

> [!IMPORTANT]
> Turn on **Beta API** on experiments section to make this addon work perfectly !
> ![](https://cdn.discordapp.com/attachments/1272023964348186627/1519735369032138837/Screenshot_2026-06-25_230353.png?ex=6a3ea35b&is=6a3d51db&hm=f84aefa4e4b5d0be97c26559226bc23d8ee25057e1fdd02e92062c836c5d9273&)

---

## Commands Available

- `/rank rankui` : Open Rank Manager Form UI **(Note: Please add RANK2026:ADMIN tag to get a permission)**
  `for e.g: / tag @s add RANK2026:ADMIN`
-
- `/setrank [selector: target] [rankId: int]` Set selected entity
- Permission: Only **GameDirectors** could use this command or the command block
- `/nick <set|reset> [selector: target] [value: string]` Set or reset the nickname of the target entity
- Permission: Only **GameDirectors** could use this command or the command block

### Command Example

- `/setrank Bob 0` : Set Bob's Rank to Admin (which is Id for admin Rank)
- `/nick set Bob Jason` : Set Bob's Nickname to Jason
- `/nick reset Bob` : Reset Bob's Nickname

---

#### FORM GUI MANAGEMENT INTERFACE

Rank management interface can be accessed via '`/rank rankui`' command

Here is the form gui looks like:

![](https://cdn.discordapp.com/attachments/1272023964348186627/1519737488602697768/Screenshot_2026-06-24_234130.png?ex=6a3ea554&is=6a3d53d4&hm=768e9fb116db0595bf38fd7c46bc914954983d13ab71198c1c4338017c8767d4&)

1.  Add Rank
    ![](https://media.discordapp.net/attachments/1272023964348186627/1519736215580967032/Screenshot_2026-06-24_234137.png?ex=6a3ea425&is=6a3d52a5&hm=f85d46d0940620775ad46335236dbc31ddf5a3f54c09a6e2f66264241e001e01&=&format=webp&quality=lossless&width=770&height=635&)
    - **Rank ID [TextField]** : A numerical identifier for the rank. The next available ID must be $\ge 2$, as IDs 0 and 1 are reserved/hardcoded for the initial default ranks (ADMIN and Member).

    - **Rank Name [TextField]** : Enter a name for the rank. This name makes it easy to find and identify the rank in the GUI without needing to memorize the ID.

    - **Rank Display Format [TextField]** : Enter a display format for the rank. This format will be used to display the rank in the chat and player nametag.

      E.g: - §6[ADMIN]§r

    > [!NOTE]
    > The forms for **Edit Rank**, **Remove Rank**, and **Set Player Rank** are designed to be intuitive and easy to use. For a detailed description of each field, please refer to the instructions provided on the Add Rank button as described above

### Additonal Overview

- Player Nametag overview
  ![](https://media.discordapp.net/attachments/1272023964348186627/1519736166658736169/0dc10364-75b7-a039-8241-c9c639883c8f.jpeg?ex=6a3f4cd9&is=6a3dfb59&hm=e66c25031c8a01c94360b36d3decf2779d2061c0247334362e9539afe938f275&=&format=webp&width=694&height=635)

- Remove Rank Overview
  ![](https://cdn.discordapp.com/attachments/1272023964348186627/1520090555801931958/image.png?ex=6a3fee26&is=6a3e9ca6&hm=9160e9d4a45a57b3ef1f0a1a5762c50e4854e8a7c2a545bbd45e98762a78140a&)
- Set Player Rank Overview
  ![](https://cdn.discordapp.com/attachments/1272023964348186627/1520090899617550536/image.png?ex=6a3fee78&is=6a3e9cf8&hm=452a504ea1c798d5e8301a0c4057202a1d5fea25c5c181d031cb81224ff10dfe&)
- Edit Rank Overview
  ![](https://media.discordapp.net/attachments/1272023964348186627/1520091189670445086/image.png?ex=6a3feebd&is=6a3e9d3d&hm=838f05eca331f18352f30757bb56f752ba610bbe545e1e26f00b3ffdc776261b&=&format=webp&quality=lossless&width=803&height=635)
- Utilize `/nick` command on command block
  ![](https://media.discordapp.net/attachments/1272023964348186627/1519738318206799956/Screenshot_2026-06-25_231655.png?ex=6a3f4eda&is=6a3dfd5a&hm=b543c0cd14ca8989c4d0343763f4790696fdb54dded2a73893207996a0c22984&=&format=webp&quality=lossless&width=805&height=635)
- Utilize `/setrank` command on command block
  ![](https://cdn.discordapp.com/attachments/1272023964348186627/1520092982420963358/image.png?ex=6a3ff068&is=6a3e9ee8&hm=8381614f2b6e2690241c58e2b0e1c1fd06b72566e034c73167cb2f66508112a7&)
