let addonId, rootURI;

function install(data, reason) { }
function uninstall(data, reason) { }

function getPrefs() {
  const prefValue = Zotero.Prefs.get("extensions.special-tags-column.prefs") || "{}";
  return JSON.parse(typeof prefValue === 'string' ? prefValue : "{}");
}

const COLUMN = {
  dataKey: "specialTags",
  label: "Special Tags",
  pluginID: "special_tags_column@qiujv.com",
  width: "120",
  fixedWidth: false,
  zoteroPersist: ["width", "hidden", "sortDirection"],
  dataProvider: (item, dataKey) => {
    if (!item.isRegularItem()) {
      Zotero.debug("Special Tags Column: Item " + item.id + " is not a regular item");
      return "";
    }

    // 获取条目的所有标签
    try {
      const tags = item.getTags();
      Zotero.debug("Special Tags Column: Item " + item.id + " tags - " + JSON.stringify(tags));

      // 提取标签文本
      const tagNames = [];
      for (const tag of tags) {
        if (typeof tag === 'string') {
          tagNames.push(tag);
        } else if (tag && typeof tag === 'object') {
          tagNames.push(tag.tag || tag.name || "");
        }
      }
      Zotero.debug("Special Tags Column: Item " + item.id + " tag names - " + JSON.stringify(tagNames));

      // 筛选以#开头的标签
      const hashTags = tagNames.filter(t => t && t.startsWith("#"));
      Zotero.debug("Special Tags Column: Item " + item.id + " hash tags - " + JSON.stringify(hashTags));

      // 返回标签字符串
      const result = hashTags.join(" ");
      Zotero.debug("Special Tags Column: Item " + item.id + " result - " + result);
      return result;
    } catch (e) {
      Zotero.debug("Special Tags Column: Error in dataProvider - " + e.message);
      return "";
    }
  }
};

function startup(data, reason) {
  addonId = data.id;
  rootURI = data.rootURI;
  Zotero.debug("Special Tags Column: bootstrap.js loaded.");
  Zotero.ItemTreeManager.registerColumn(COLUMN);
  Zotero.debug("Special Tags Column: Column registration call executed.");
}

function shutdown(data, reason) {
  if (reason === "APP_SHUTDOWN") return;
  try {
    Zotero.ItemTreeManager.unregisterColumn("special_tags_column@qiujv.com");
  } catch (_) { }
}
