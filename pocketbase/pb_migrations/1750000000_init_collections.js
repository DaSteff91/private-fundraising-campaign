/// <reference path="../pb_data/types.d.ts" />
/**
 * Initial schema: settings, donations, translations.
 * Rules: list/view public (""); create/update/delete admin only (null).
 */
migrate(
  (app) => {
    const phases = ["collecting", "funds_sent", "funds_delivered", "closed"];

    app.save(
      new Collection({
        name: "settings",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "closeDate", type: "text", required: true },
          {
            name: "phase",
            type: "select",
            required: true,
            maxSelect: 1,
            values: phases,
          },
          { name: "updatedAt", type: "text", required: true },
          { name: "amountLocal", type: "number", required: false },
        ],
      }),
    );

    app.save(
      new Collection({
        name: "donations",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "date", type: "text", required: true },
          // Not required: PocketBase treats 0 as blank when required is true.
          { name: "amount", type: "number", required: false },
          {
            name: "image",
            type: "file",
            required: false,
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ["image/webp", "image/jpeg", "image/png"],
          },
          { name: "captionDe", type: "text", required: false },
          { name: "captionEn", type: "text", required: false },
          { name: "captionPt", type: "text", required: false },
          { name: "captionEs", type: "text", required: false },
        ],
      }),
    );

    app.save(
      new Collection({
        name: "translations",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "lang", type: "text", required: true },
          { name: "payload", type: "json", required: true },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_translations_lang ON translations (lang)",
        ],
      }),
    );
  },
  (app) => {
    for (const name of ["translations", "donations", "settings"]) {
      try {
        app.delete(app.findCollectionByNameOrId(name));
      } catch {
        // already removed
      }
    }
  },
);
