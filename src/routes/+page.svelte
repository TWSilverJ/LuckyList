<script lang="ts">
    import axios from 'axios';
    import type { List, Item, SelectionHistory } from '$lib/types';

    let lists = $state<List[]>([]);
    let selectedList = $state<List | null>(null);
    let items = $state<Item[]>([]);
    let history = $state<SelectionHistory[]>([]);
    let selectedItem = $state<Item | null>(null);
    let isSelecting = $state(false);
    let showHistory = $state(false);

    // 表單狀態
    let newListName = $state('');
    let newListDescription = $state('');
    let newItemName = $state('');
    let newItemWeight = $state(1);
    let editingList = $state<List | null>(null);
    let editingItem = $state<Item | null>(null);

    // 載入清單
    async function loadLists() {
        try {
            const { data } = await axios.get('/api/lists');
            if (data.success) {
                lists = data.data;
            }
        } catch (error) {
            console.error('載入清單失敗:', error);
        }
    }

    // 建立清單
    async function createList() {
        if (!newListName.trim()) return;
        try {
            const { data } = await axios.post('/api/lists', {
                name: newListName,
                description: newListDescription
            });
            if (data.success) {
                lists = [data.data, ...lists];
                newListName = '';
                newListDescription = '';
            }
        } catch (error) {
            console.error('建立清單失敗:', error);
        }
    }

    // 選擇清單
    async function selectList(list: List) {
        selectedList = list;
        selectedItem = null;
        showHistory = false;
        await loadItems();
    }

    // 載入項目
    async function loadItems() {
        if (!selectedList) return;
        try {
            const { data } = await axios.get(`/api/lists/${selectedList.id}/items`);
            if (data.success) {
                items = data.data;
            }
        } catch (error) {
            console.error('載入項目失敗:', error);
        }
    }

    // 新增項目
    async function addItem() {
        if (!selectedList || !newItemName.trim()) return;
        try {
            const { data } = await axios.post(`/api/lists/${selectedList.id}/items`, {
                name: newItemName,
                weight: newItemWeight
            });
            if (data.success) {
                items = [...items, data.data];
                newItemName = '';
                newItemWeight = 1;
            }
        } catch (error) {
            console.error('新增項目失敗:', error);
        }
    }

    // 刪除項目
    async function deleteItem(item: Item) {
        if (!selectedList) return;
        if (!confirm(`確定要刪除「${item.name}」嗎？`)) return;
        try {
            const { data } = await axios.delete(`/api/lists/${selectedList.id}/items/${item.id}`);
            if (data.success) {
                items = items.filter((i) => i.id !== item.id);
            }
        } catch (error) {
            console.error('刪除項目失敗:', error);
        }
    }

    // 隨機選擇
    async function randomSelect() {
        if (!selectedList || items.length === 0) return;
        isSelecting = true;
        selectedItem = null;

        // 動畫效果
        const animationDuration = 2000;
        const interval = 100;
        let elapsed = 0;

        const animate = setInterval(() => {
            elapsed += interval;
            const randomIndex = Math.floor(Math.random() * items.length);
            selectedItem = items[randomIndex];

            if (elapsed >= animationDuration) {
                clearInterval(animate);
                doSelect();
            }
        }, interval);
    }

    async function doSelect() {
        if (!selectedList) return;
        try {
            const { data } = await axios.post(`/api/lists/${selectedList.id}/select`);
            if (data.success) {
                selectedItem = data.data;
            }
        } catch (error) {
            console.error('隨機選擇失敗:', error);
        }
        isSelecting = false;
    }

    // 載入歷程
    async function loadHistory() {
        if (!selectedList) return;
        try {
            const { data } = await axios.get(`/api/lists/${selectedList.id}/select`, {
                params: { limit: 50 }
            });
            if (data.success) {
                history = data.data;
            }
        } catch (error) {
            console.error('載入歷程失敗:', error);
        }
    }

    // 切換歷程顯示
    async function toggleHistory() {
        showHistory = !showHistory;
        if (showHistory) {
            await loadHistory();
        }
    }

    // 刪除清單
    async function deleteList(list: List) {
        if (!confirm(`確定要刪除「${list.name}」及其所有項目嗎？`)) return;
        try {
            const { data } = await axios.delete(`/api/lists/${list.id}`);
            if (data.success) {
                lists = lists.filter((l) => l.id !== list.id);
                if (selectedList?.id === list.id) {
                    selectedList = null;
                    items = [];
                }
            }
        } catch (error) {
            console.error('刪除清單失敗:', error);
        }
    }

    // 更新清單
    async function updateList() {
        if (!editingList) return;
        try {
            const { data } = await axios.put(`/api/lists/${editingList.id}`, {
                name: editingList.name,
                description: editingList.description
            });
            if (data.success) {
                lists = lists.map((l) => (l.id === data.data.id ? data.data : l));
                if (selectedList?.id === data.data.id) {
                    selectedList = data.data;
                }
                editingList = null;
            }
        } catch (error) {
            console.error('更新清單失敗:', error);
        }
    }

    // 更新項目
    async function updateItem() {
        if (!selectedList || !editingItem) return;
        try {
            const { data } = await axios.put(`/api/lists/${selectedList.id}/items/${editingItem.id}`, {
                name: editingItem.name,
                weight: editingItem.weight
            });
            if (data.success) {
                items = items.map((i) => (i.id === data.data.id ? data.data : i));
                editingItem = null;
            }
        } catch (error) {
            console.error('更新項目失敗:', error);
        }
    }

    // 初始化資料庫
    async function initDb() {
        if (!confirm('確定要初始化資料庫嗎？這會建立所需的資料表。')) return;
        try {
            const { data } = await axios.post('/api/init');
            if (data.success) {
                alert('資料庫初始化完成！');
                await loadLists();
            } else {
                alert('初始化失敗：' + data.error);
            }
        } catch (error) {
            console.error('初始化資料庫失敗:', error);
            alert('初始化失敗');
        }
    }

    // 頁面載入時取得清單
    $effect(() => {
        loadLists();
    });
</script>

<svelte:head>
    <title>Lucky List - 隨機選擇器</title>
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-purple-500 to-pink-500 p-4 md:p-8">
    <div class="mx-auto max-w-6xl">
        <!-- 標題 -->
        <header class="mb-8 text-center">
            <h1 class="mb-2 text-4xl font-bold text-white drop-shadow-lg">🎲 Lucky List</h1>
            <p class="text-white/80">建立清單，隨機選擇，記錄歷程</p>
            <button onclick={initDb} class="mt-2 text-sm text-white/60 underline hover:text-white">
                初始化資料庫
            </button>
        </header>

        <div class="grid gap-6 md:grid-cols-3">
            <!-- 清單列表 -->
            <div class="rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                <h2 class="mb-4 text-xl font-semibold text-gray-800">📋 我的清單</h2>

                <!-- 新增清單表單 -->
                <div class="mb-4 space-y-2">
                    <input
                        type="text"
                        bind:value={newListName}
                        placeholder="清單名稱"
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                    <textarea
                        bind:value={newListDescription}
                        placeholder="描述（選填）"
                        rows="2"
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    ></textarea>
                    <button
                        onclick={createList}
                        disabled={!newListName.trim()}
                        class="w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ➕ 建立清單
                    </button>
                </div>

                <!-- 清單列表 -->
                <div class="max-h-96 space-y-2 overflow-y-auto">
                    {#each lists as list}
                        <div
                            class="group flex cursor-pointer items-center justify-between rounded-lg p-3 transition {selectedList?.id ===
                            list.id
                                ? 'bg-purple-100 ring-2 ring-purple-400'
                                : 'bg-gray-50 hover:bg-gray-100'}"
                            onclick={() => selectList(list)}
                            onkeydown={(e) => e.key === 'Enter' && selectList(list)}
                            role="button"
                            tabindex="0"
                        >
                            <div class="flex-1 overflow-hidden">
                                <div class="truncate font-medium text-gray-800">{list.name}</div>
                                {#if list.description}
                                    <div class="truncate text-sm text-gray-500">{list.description}</div>
                                {/if}
                            </div>
                            <button
                                onclick={(e) => {
                                    e.stopPropagation();
                                    deleteList(list);
                                }}
                                class="ml-2 rounded p-1 text-red-500 opacity-0 transition group-hover:opacity-100 hover:bg-red-100"
                            >
                                🗑️
                            </button>
                        </div>
                    {/each}
                    {#if lists.length === 0}
                        <p class="py-8 text-center text-gray-400">還沒有清單，建立一個吧！</p>
                    {/if}
                </div>
            </div>

            <!-- 項目管理與隨機選擇 -->
            <div class="rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-sm md:col-span-2">
                {#if selectedList}
                    <div class="mb-4 flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-800">
                            {selectedList.name}
                        </h2>
                        <button
                            onclick={toggleHistory}
                            class="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-200"
                        >
                            {showHistory ? '📝 項目' : '📜 歷程'}
                        </button>
                    </div>

                    {#if !showHistory}
                        <!-- 隨機選擇區 -->
                        <div class="mb-6 rounded-xl bg-linear-to-r from-yellow-400 to-orange-400 p-6 text-center">
                            {#if selectedItem}
                                <div class="mb-2 text-lg text-white/80">選中的是...</div>
                                <div
                                    class="text-3xl font-bold text-white drop-shadow-lg {isSelecting
                                        ? 'animate-pulse'
                                        : 'animate-bounce'}"
                                >
                                    🎉 {selectedItem.name}
                                </div>
                            {:else}
                                <div class="text-xl text-white/80">點擊下方按鈕開始抽選！</div>
                            {/if}
                            <button
                                onclick={randomSelect}
                                disabled={isSelecting || items.length === 0}
                                class="mt-4 rounded-full bg-white px-8 py-3 text-lg font-semibold text-orange-500 shadow-lg transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSelecting ? '🎲 抽選中...' : '🎲 隨機選擇'}
                            </button>
                        </div>

                        <!-- 新增項目 -->
                        <div class="mb-4 flex gap-2">
                            <input
                                type="text"
                                bind:value={newItemName}
                                placeholder="項目名稱"
                                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                onkeydown={(e) => e.key === 'Enter' && addItem()}
                            />
                            <input
                                type="number"
                                bind:value={newItemWeight}
                                min="1"
                                max="100"
                                title="權重 (1-100)"
                                class="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                            />
                            <button
                                onclick={addItem}
                                disabled={!newItemName.trim()}
                                class="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                ➕
                            </button>
                        </div>

                        <!-- 項目列表 -->
                        <div class="max-h-64 space-y-2 overflow-y-auto">
                            {#each items as item}
                                <div
                                    class="group flex items-center justify-between rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100 {selectedItem?.id ===
                                    item.id
                                        ? 'ring-2 ring-yellow-400'
                                        : ''}"
                                >
                                    {#if editingItem?.id === item.id}
                                        <div class="flex flex-1 gap-2">
                                            <input
                                                type="text"
                                                bind:value={editingItem.name}
                                                class="flex-1 rounded border px-2 py-1"
                                            />
                                            <input
                                                type="number"
                                                bind:value={editingItem.weight}
                                                min="1"
                                                class="w-16 rounded border px-2 py-1 text-center"
                                            />
                                            <button onclick={updateItem} class="text-green-500">✔️</button>
                                            <button onclick={() => (editingItem = null)} class="text-gray-500"
                                                >✖️</button
                                            >
                                        </div>
                                    {:else}
                                        <div class="flex-1">
                                            <span class="font-medium text-gray-800">{item.name}</span>
                                            {#if item.weight > 1}
                                                <span
                                                    class="ml-2 rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-600"
                                                >
                                                    ×{item.weight}
                                                </span>
                                            {/if}
                                        </div>
                                        <div class="flex gap-1 opacity-0 transition group-hover:opacity-100">
                                            <button
                                                onclick={() => (editingItem = { ...item })}
                                                class="rounded p-1 text-blue-500 hover:bg-blue-100"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onclick={() => deleteItem(item)}
                                                class="rounded p-1 text-red-500 hover:bg-red-100"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                            {#if items.length === 0}
                                <p class="py-8 text-center text-gray-400">這個清單還沒有項目，新增一些吧！</p>
                            {/if}
                        </div>
                    {:else}
                        <!-- 歷程 -->
                        <div class="max-h-96 space-y-2 overflow-y-auto">
                            {#each history as record}
                                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span class="font-medium text-gray-800">{record.item_name || '已刪除的項目'}</span>
                                    <span class="text-sm text-gray-500">
                                        {new Date(record.selectedAt).toLocaleString('zh-TW')}
                                    </span>
                                </div>
                            {/each}
                            {#if history.length === 0}
                                <p class="py-8 text-center text-gray-400">還沒有選擇歷程</p>
                            {/if}
                        </div>
                    {/if}
                {:else}
                    <div class="flex h-64 items-center justify-center">
                        <p class="text-gray-400">👈 請先選擇一個清單</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
