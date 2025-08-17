/** @type {string} */
let addonId;
/** @type {string} */
let rootURI;

/** @param {any} data @param {any} reason */
function install(data, reason) { }
/** @param {any} data @param {any} reason */
function uninstall(data, reason) { }

const COLUMN = {
  dataKey: "hashTagsColumn",
  label: "Hash Tags",
  pluginID: "hashtags_column@qiujv",
  width: "120",
  fixedWidth: false,
  zoteroPersist: ["width", "hidden", "sortDirection"],

  /** @param {Zotero.Item} item @param {string} dataKey */
  dataProvider: (item, dataKey) => {
    if (!item.isRegularItem()) {
      return "";
    }

    let hashPrefixes = ["#", "@", "!", "%"];

    try {
      const tagNames = [];
      for (const tag of item.getTags()) {
        if (typeof tag === 'string') {
          tagNames.push(tag);
        } else if (tag && typeof tag === 'object') {
          tagNames.push(tag.tag || "");
        }
      }

      const hashTags = tagNames.filter(t => t && hashPrefixes.some(prefix => t.startsWith(prefix)));

      return hashTags.join(" ");
    } catch (/** @type {any} */ e) {
      const errorMessage = e.message || String(e);
      Zotero.logError(new Error("HashTags Column: Error in dataProvider - " + errorMessage));
      return "";
    }
  },

  /** @param {number} index @param {string} data @param {any} column @param {boolean} isFirstColumn @param {Document} doc */
  renderCell: (index, data, column, isFirstColumn, doc) => {
    const cell = doc.createElement("span");
    cell.className = `cell ${column.className}`
    if (!data) return cell;

    const tags = data.split(" ").filter(t => t.length > 0);

    tags.forEach((tag, i) => {
      if (i > 0) {
        cell.appendChild(doc.createTextNode(" "));
      }

      const span = doc.createElement("span");
      span.textContent = tag;

      switch (tag.charAt(0)) {
        case "#":
          span.style.setProperty("color", "#1976d2", "important");
          break;
        case "@":
          span.style.setProperty("color", "#f57c00", "important");
          break;
        default:
          span.style.setProperty("color", "#000000", "important");
      }
      cell.appendChild(span);
    });
    return cell;
  }
};

/** @param {any} data @param {any} reason */
function startup(data, reason) {
  addonId = data.id;
  rootURI = data.rootURI;
  Zotero.ItemTreeManager.registerColumn(COLUMN);
}

/** @param {any} data @param {any} reason */
function shutdown(data, reason) {
  // if (reason === "APP_SHUTDOWN") return;
  try {
    Zotero.ItemTreeManager.unregisterColumn(addonId);
  } catch (_) { }
}