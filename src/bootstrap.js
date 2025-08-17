/** @type {string} */
let addonId;
/** @type {string} */
let rootURI;

const hashPrefixes = ["#", "@", "-", "!", "%", "^", "&", "*"];
const prefixColors = ["#1976d2", "#f57c00", "#4caf50", "#9c27b0", "#2196f3", "#ff5722", "#009688", "#e91e63"];

/** @param {any} data @param {any} reason */
function install(data, reason) { }
/** @param {any} data @param {any} reason */
function uninstall(data, reason) { }

// /**@returns {string[]} */
// function getHashPrefixes() {
//   try {
//     const prefixesSetting = Zotero.Prefs.get('extensions.hashtags_column.prefixes', true);

//     if (prefixesSetting && typeof prefixesSetting === 'string') {
//       return prefixesSetting.split('');
//     }
//   } catch (/** @type {any} */ e) {
//     Zotero.logError(new Error("HashTags Column: Error reading prefixes from settings - " + e.message));
//   }

//   return "#@-!%^&*".split('');
// }

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

      // return hashTags.join(" ");
      return JSON.stringify(hashTags);
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

    /** @type {string[]} */
    let tags = [];
    try {
      tags = JSON.parse(data);
    } catch (e) {
      tags = data.split(" ").filter(t => t.length > 0);
    }

    tags.forEach((/** @type {string} */ tag, /** @type {number} */ i) => {
      if (i > 0) {
        cell.appendChild(doc.createTextNode(" "));
      }

      const span = doc.createElement("span");
      span.textContent = tag;

      const prefixIndex = hashPrefixes.indexOf(tag.charAt(0));
      if (prefixIndex !== -1 && prefixIndex < prefixColors.length) {
        span.style.setProperty("color", prefixColors[prefixIndex], "important");
      } else { }
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
  if (reason === "APP_SHUTDOWN") return;
  try {
    Zotero.ItemTreeManager.unregisterColumn(addonId);
  } catch (_) { }
}