let addonId, rootURI;

/** @param {any} data @param {any} reason */
function install(data, reason) { }
/** @param {any} data @param {any} reason */
function uninstall(data, reason) { }

const COLUMN = {
  dataKey: "specialTags",
  label: "Special Tags",
  pluginID: "special_tags_column@qiujv.com",
  width: "120",
  fixedWidth: false,
  zoteroPersist: ["width", "hidden", "sortDirection"],

  /** @param {Zotero.Item} item @param {string} dataKey */
  dataProvider: (item, dataKey) => {
    if (!item.isRegularItem()) {
      return "";
    }

    try {
      const tags = item.getTags();

      const tagNames = [];
      for (const tag of tags) {
        if (typeof tag === 'string') {
          tagNames.push(tag);
        } else if (tag && typeof tag === 'object') {
          tagNames.push(tag.tag || "");
        }
      }

      let specialPrefixes = ["#", "@", "!", "%"];

      const specialTags = tagNames.filter(t => t && specialPrefixes.some(prefix => t.startsWith(prefix)));

      const result = specialTags.join(" ");
      return result;
    } catch (/** @type {any} */ e) {
      const errorMessage = e.message || String(e);
      Zotero.logError(new Error("Special Tags Column: Error in dataProvider - " + errorMessage));
      return "";
    }
  },

  // /** @param {number} index @param {string} data @param {any} column @param {Document} cell */
  // renderCell: (index, data, column, cell) => {
  //   // 清空 cell 原有内容
  //   cell.replaceChildren();

  //   if (!data) return;

  //   const document = Zotero.getMainWindow().document;
  //   const tags = data.split(" ").filter(t => t.length > 0);

  //   tags.forEach((tag, i) => {
  //     if (i > 0) {
  //       cell.appendChild(document.createTextNode(" "));
  //     }

  //     const span = document.createElement("span");
  //     span.textContent = tag;

  //     // 按前缀上色
  //     switch (tag.charAt(0)) {
  //       case "#":
  //         span.style.setProperty("color", "#1976d2", "important");
  //         break;
  //       case "@":
  //         span.style.setProperty("color", "#f57c00", "important");
  //         break;
  //       default:
  //         span.style.setProperty("color", "#000000", "important");
  //     }
  //     cell.appendChild(span);
  //   });
  // }
};

/** @param {any} data @param {any} reason */
function startup(data, reason) {
  addonId = data.id;
  rootURI = data.rootURI;
  Zotero.ItemTreeManager.registerColumn(COLUMN);
}

/** @param {any} data @param {any} reason */
function shutdown(data, reason) {
  if (reason === "APP_SHUTDOWN") return;
  try {
    Zotero.ItemTreeManager.unregisterColumn("special_tags_column@qiujv.com");
  } catch (_) { }
}