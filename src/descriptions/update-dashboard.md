Patch an existing dashboard's layout configuration. This tool is primarily used for modifying the layout of widgets on a dashboard after they have been created.
You will always want to call this after creating a dashboard and all its widgets so you can give a favorable layout to the user. Widgets should always have a size specified.
The layout configuration is organized by screen breakpoint sizes (xs, sm, md, lg, xl) and includes positioning information for each widget. Each layout item contains:

- `i`: Widget ID
- `x`: X coordinate (horizontal position)
- `y`: Y coordinate (vertical position)
- `w`: Width in grid units
- `h`: Height in grid units
- `moved`: Whether the widget has been moved (should always be false)
- `static`: Whether the widget position is fixed (should always be false)

Example layout configuration:

```json
{
  "xs": [],
  "sm": [],
  "md": [
    {
      "w": 5,
      "h": 2,
      "x": 0,
      "y": 0,
      "i": "widget-id-1",
      "moved": false,
      "static": false
    }
  ],
  "lg": [],
  "xl": []
}
```

Here's an example layout that should be used for inspiration:

```json
"layouts": {
    "xs": [],
    "sm": [
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 0,
        "i": "cc1bb92b-736b-4b76-bb2a-4ffb3fb6db04"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 1,
        "i": "750ea929-fb31-46ef-b1d4-68c53b06e5a3"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 2,
        "i": "92507e3e-2c99-4089-b75a-ce97ad4743d5"
      },
      {
        "w": 2,
        "h": 2,
        "x": 0,
        "y": 3,
        "i": "f1535f10-a7ba-4c74-8ae6-d5be8c5655ee"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 7,
        "i": "29df3495-eea3-45a2-b779-788d92c8baa4"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 8,
        "i": "814000f8-9ffd-4ac3-90f8-26d321e9eba6"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 9,
        "i": "293fc7fd-eb34-4383-82b8-068b62ffdd61"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 10,
        "i": "b2e1c9b2-9da8-40d9-a068-9a6a4e0f2ed3"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 11,
        "i": "24bf65f6-e196-4e49-9e91-7d5bceb5c080"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 12,
        "i": "ce89d0fe-cd1d-4590-bffe-91c6f394ae4d"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 13,
        "i": "883dc4ba-6e75-44e6-8c42-8979c63c2a12"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 14,
        "i": "6ed5488a-0969-4cda-af4b-2ecb74b3963c"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 15,
        "i": "7a5c6998-df18-474c-be1c-5938a5e68943"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 16,
        "i": "3810193b-b6b6-428c-ab5c-48217d234ab4"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 17,
        "i": "f6a487a4-b385-421e-bfb8-03b1e651ce25"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 18,
        "i": "fd572af2-0df0-4d66-95e0-913cd79b973d"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 19,
        "i": "d1096b70-22fb-47d2-95d3-e1d63416d8e3"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 20,
        "i": "7d2e98b1-48cb-40bd-bef0-19e735c1fd3f"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 21,
        "i": "373a6c3e-77ee-4044-ba11-af176c813fb0"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 22,
        "i": "d679fc5e-ead3-4b7d-b650-559167edbeff"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 23,
        "i": "ce48c3e2-5ff9-42c6-85c3-e87ae9148762"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 24,
        "i": "384f066c-a4fe-4c26-b7cb-08f333cf9fac"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 25,
        "i": "b1caf3ba-4c6e-45aa-8def-e94f1d9e0e3c"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 26,
        "i": "c18dbb26-ecd1-4f19-ab9a-0de6980da2dc"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 27,
        "i": "450cc2ff-8f00-4311-b508-db8084df8725"
      },
      {
        "w": 2,
        "h": 2,
        "x": 0,
        "y": 5,
        "i": "befe345c-e392-40de-ad1b-97a38ac18503"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 28,
        "i": "e8f652ba-d3ac-4adb-a16e-f410af56414b"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 29,
        "i": "448f356d-d79f-47a2-a6ed-6ddf93d50f90"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 30,
        "i": "4d8ec87c-9a01-41eb-a659-bb9ad2afd283"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 31,
        "i": "6022a63e-38c0-42a4-bb9c-6a2c2e571da2"
      }
    ],
    "md": [],
    "lg": [
      {
        "w": 8,
        "h": 2,
        "x": 4,
        "y": 34,
        "i": "cc1bb92b-736b-4b76-bb2a-4ffb3fb6db04"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 9,
        "i": "750ea929-fb31-46ef-b1d4-68c53b06e5a3"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 8,
        "i": "92507e3e-2c99-4089-b75a-ce97ad4743d5"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 1,
        "i": "f1535f10-a7ba-4c74-8ae6-d5be8c5655ee"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 24,
        "i": "29df3495-eea3-45a2-b779-788d92c8baa4"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 29,
        "i": "814000f8-9ffd-4ac3-90f8-26d321e9eba6"
      },
      {
        "w": 4,
        "h": 2,
        "x": 0,
        "y": 18,
        "i": "293fc7fd-eb34-4383-82b8-068b62ffdd61"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 22,
        "i": "b2e1c9b2-9da8-40d9-a068-9a6a4e0f2ed3"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 15,
        "i": "24bf65f6-e196-4e49-9e91-7d5bceb5c080"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 33,
        "i": "ce89d0fe-cd1d-4590-bffe-91c6f394ae4d"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 20,
        "i": "883dc4ba-6e75-44e6-8c42-8979c63c2a12"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 22,
        "i": "6ed5488a-0969-4cda-af4b-2ecb74b3963c"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 31,
        "i": "7a5c6998-df18-474c-be1c-5938a5e68943"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 20,
        "i": "3810193b-b6b6-428c-ab5c-48217d234ab4"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 6,
        "i": "f6a487a4-b385-421e-bfb8-03b1e651ce25"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 3,
        "i": "fd572af2-0df0-4d66-95e0-913cd79b973d"
      },
      {
        "w": 7,
        "h": 2,
        "x": 5,
        "y": 11,
        "i": "d1096b70-22fb-47d2-95d3-e1d63416d8e3"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 5,
        "i": "7d2e98b1-48cb-40bd-bef0-19e735c1fd3f"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 3,
        "i": "373a6c3e-77ee-4044-ba11-af176c813fb0"
      },
      {
        "w": 8,
        "h": 2,
        "x": 4,
        "y": 18,
        "i": "d679fc5e-ead3-4b7d-b650-559167edbeff"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 31,
        "i": "ce48c3e2-5ff9-42c6-85c3-e87ae9148762"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 26,
        "i": "384f066c-a4fe-4c26-b7cb-08f333cf9fac"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 36,
        "i": "b1caf3ba-4c6e-45aa-8def-e94f1d9e0e3c"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 1,
        "i": "c18dbb26-ecd1-4f19-ab9a-0de6980da2dc"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 0,
        "i": "450cc2ff-8f00-4311-b508-db8084df8725"
      },
      {
        "w": 5,
        "h": 2,
        "x": 0,
        "y": 11,
        "i": "befe345c-e392-40de-ad1b-97a38ac18503"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 17,
        "i": "e8f652ba-d3ac-4adb-a16e-f410af56414b"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 13,
        "i": "448f356d-d79f-47a2-a6ed-6ddf93d50f90"
      },
      {
        "w": 4,
        "h": 2,
        "x": 0,
        "y": 34,
        "i": "4d8ec87c-9a01-41eb-a659-bb9ad2afd283"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 27,
        "i": "6022a63e-38c0-42a4-bb9c-6a2c2e571da2"
      }
    ],
    "xl": []
  }
```
