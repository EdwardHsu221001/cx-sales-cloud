## ADDED Requirements

### Requirement: 建立潛客

潛客清單頁 SHALL 提供「手動新增」入口，開啟一個空白抽屜表單。表單欄位 SHALL 包含：姓名、公司、職稱、來源、評分、狀態、聯絡方式（Email／電話）、負責人（固定三人下拉）。姓名與公司為必填。狀態下拉 MUST 只含工作狀態（`new`／`contacted`／`followed`／`toconvert`／`overdue`），終態 `converted` MUST NOT 可被手動選取（僅由轉換動作設定）。儲存成功後 SHALL 在清單新增一筆，並關閉抽屜；顯示用欄位（頭像首字、負責人底色與首字、`canConvert`）MUST 由系統自動推導，而非由使用者填寫。

#### Scenario: 成功建立潛客

- **WHEN** 使用者開啟新增抽屜、填妥姓名與公司後按儲存
- **THEN** 清單新增一筆對應潛客，「共 N 筆」總數加一，抽屜關閉

#### Scenario: 必填欄位缺漏時阻擋

- **WHEN** 使用者未填姓名或公司就按儲存
- **THEN** 表單顯示對應欄位的錯誤訊息，且不新增任何潛客、抽屜維持開啟

#### Scenario: 取消不建立

- **WHEN** 使用者在抽屜按取消或 Esc
- **THEN** 抽屜關閉且清單筆數不變

### Requirement: 編輯潛客

潛客清單頁 SHALL 在每一可編輯列提供編輯入口，開啟與新增共用的抽屜並帶入該筆現值。儲存成功後 SHALL 以新值更新該筆並關閉抽屜。編輯 MUST 採不可變更新（產生新清單），不可原地修改既有物件。

#### Scenario: 成功編輯潛客

- **WHEN** 使用者於某列點編輯、修改欄位後按儲存
- **THEN** 該列顯示更新後的值，清單筆數不變，抽屜關閉

#### Scenario: 編輯時必填驗證一致

- **WHEN** 使用者在編輯抽屜把姓名或公司清空後按儲存
- **THEN** 顯示錯誤訊息且不更新該筆

#### Scenario: 狀態下拉不含已轉化

- **WHEN** 使用者開啟新增或編輯抽屜檢視狀態下拉
- **THEN** 下拉選項只含工作狀態，不出現 `converted`（已轉化）

### Requirement: 刪除潛客

潛客清單頁 SHALL 在每一可刪除列提供刪除入口。點擊後 SHALL 先顯示確認 modal（確定／取消）；僅在確定時移除該筆。刪除 MUST 採不可變更新。

#### Scenario: 確認後刪除

- **WHEN** 使用者點刪除並在確認 modal 按確定
- **THEN** 該筆從清單移除，「共 N 筆」總數減一

#### Scenario: 取消不刪除

- **WHEN** 使用者點刪除但在確認 modal 按取消
- **THEN** 清單不變、modal 關閉

### Requirement: 轉換潛客並鎖定

當潛客 `status` 為 `toconvert` 時，清單列 SHALL 顯示「轉換」入口；確認轉換後系統 SHALL 將該筆 `status` 設為 `converted`、`canConvert` 設為 `false`。本變更不建立下游客戶／聯絡人／商機實體。已轉化的列 SHALL 顯示「已轉化」狀態，且其編輯與刪除入口 MUST 為停用（disabled）或隱藏，使該筆不可再被編輯或刪除。

#### Scenario: 確認轉換鎖定該筆

- **WHEN** 使用者於 `toconvert` 的潛客列確認轉換
- **THEN** 該列狀態顯示「已轉化」，編輯與刪除入口停用，且不再出現轉換入口

#### Scenario: 非 toconvert 不顯示轉換入口

- **WHEN** 某潛客的 `status` 不是 `toconvert`
- **THEN** 該列不顯示轉換入口

### Requirement: 依狀態篩選潛客

潛客清單頁 SHALL 提供狀態下拉，可選「全部」或任一狀態（含 `converted`）。選擇後表格 SHALL 只顯示符合該狀態的列。狀態篩選 MUST 與既有關鍵字搜尋並存（兩者同時套用），且「共 N 筆」計數反映套用後的可見列數。

#### Scenario: 選定狀態只顯示該狀態

- **WHEN** 使用者在狀態下拉選擇某一狀態
- **THEN** 表格只顯示該狀態的潛客列，計數隨之更新

#### Scenario: 選「全部」顯示全部

- **WHEN** 使用者在狀態下拉選擇「全部」
- **THEN** 表格顯示所有（未被關鍵字過濾掉的）潛客

#### Scenario: 狀態篩選與關鍵字搜尋並存

- **WHEN** 使用者同時輸入關鍵字並選定某狀態
- **THEN** 表格只顯示同時符合關鍵字與該狀態的列
