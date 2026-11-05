import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, Folder, Home, Plus, Search, Trash2 } from 'lucide-react';
import { ASSET_FOLDERS_LIST, getAssetFolderAssets } from '../../utils/sampleData';

function SymbolRow({ asset, selected, onAdd }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#eceef0] px-3 py-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-[#22252a]">{asset.symbol}</div>
        <div className="truncate text-xs text-[#777b80]">
          {asset.name} · {asset.basePrice.toLocaleString('en-US', { maximumFractionDigits: asset.precision ?? 2 })} {asset.unit}
          {asset.peRatio ? ` · P/E ${asset.peRatio}` : ''}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onAdd(asset.id)}
        aria-label={selected ? `${asset.symbol} tanlangan` : `${asset.symbol} ni qo'shish`}
        title={selected ? 'Ro‘yxatda mavjud' : 'Kotirovkalarga qo‘shish'}
        className={`grid size-9 shrink-0 place-items-center rounded-full border ${
          selected
            ? 'border-[#2878df] bg-[#edf5ff] text-[#2878df]'
            : 'border-[#2878df] text-[#2878df] hover:bg-[#edf5ff]'
        }`}
      >
        {selected ? <Check size={18} /> : <Plus size={19} />}
      </button>
    </div>
  );
}

export default function QuoteSymbolsManager({
  mode,
  selectedIds,
  visibleSelectedAssets,
  removalSelection,
  onToggleRemoval,
  onRemoveSelected,
  onAddAsset,
  onOpenCatalog,
  onBack
}) {
  const [folderId, setFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleAssetCount, setVisibleAssetCount] = useState(50);
  const query = searchQuery.trim().toLowerCase();
  const folders = useMemo(() => ASSET_FOLDERS_LIST.map(folder => ({
    ...folder,
    assets: getAssetFolderAssets(folder.id)
  })), []);
  const currentFolder = folders.find(folder => folder.id === folderId);

  const searchResults = useMemo(() => {
    if (!query || folderId || mode !== 'add') return [];
    const matches = folders.flatMap(folder => folder.assets)
      .filter(asset => asset.symbol.toLowerCase().includes(query) || asset.name.toLowerCase().includes(query));
    return [...new Map(matches.map(asset => [asset.id, asset])).values()];
  }, [folderId, folders, mode, query]);

  const folderAssets = currentFolder?.assets.filter(asset =>
    !query || asset.symbol.toLowerCase().includes(query) || asset.name.toLowerCase().includes(query)
  ) || [];
  const manageAssets = mode === 'manage'
    ? visibleSelectedAssets.filter(asset =>
      asset.symbol.toLowerCase().includes(query) || asset.name.toLowerCase().includes(query)
    )
    : [];

  const heading = mode === 'manage' ? 'Tanlangan aktivlar' : 'Aktiv qo‘shish';
  const visibleSearchResults = searchResults.slice(0, visibleAssetCount);
  const visibleFolderAssets = folderAssets.slice(0, visibleAssetCount);
  const visibleManageAssets = manageAssets.slice(0, visibleAssetCount);
  const updateSearch = (value) => {
    setSearchQuery(value);
    setVisibleAssetCount(50);
  };
  const openFolder = (nextFolderId) => {
    setFolderId(nextFolderId);
    setVisibleAssetCount(50);
  };

  return (
    <section className="overflow-hidden border border-[#e5e7e9] bg-white">
      <div className="flex min-h-14 items-center gap-2 border-b border-[#e5e7e9] px-3">
        <button
          type="button"
          onClick={folderId && mode === 'add' ? () => openFolder(null) : onBack}
          aria-label="Orqaga"
          className="grid size-9 shrink-0 place-items-center text-[#42464d]"
        >
          <ArrowLeft size={21} />
        </button>
        <h2 className="min-w-0 flex-1 truncate text-base font-medium text-[#22252a]">
          {mode === 'add' && currentFolder ? currentFolder.label : heading}
        </h2>
        {mode === 'manage' ? (
          <>
            <button
              type="button"
              onClick={onOpenCatalog}
              aria-label="Aktiv qo'shish"
              title="Aktiv qo‘shish"
              className="grid size-9 place-items-center text-[#2878df]"
            >
              <Plus size={26} />
            </button>
            <button
              type="button"
              onClick={onRemoveSelected}
              disabled={removalSelection.length === 0}
              aria-label="Tanlangan aktivlarni olib tashlash"
              title="Tanlanganlarni olib tashlash"
              className="grid size-9 place-items-center text-[#2878df] disabled:text-[#b8bdc3]"
            >
              <Trash2 size={21} />
            </button>
          </>
        ) : null}
      </div>

      <div className="relative border-b border-[#e5e7e9] px-3">
        <Search size={17} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666a70]" />
        <input
          value={searchQuery}
          onChange={event => updateSearch(event.target.value)}
          placeholder="Aktivlarni qidiring"
          aria-label="Aktivlarni qidiring"
          className="w-full bg-white py-3 pl-9 pr-2 text-sm text-[#25282d] outline-none placeholder:text-[#999da2]"
        />
      </div>

      {mode === 'add' ? (
        <>
          <div className="flex items-center gap-2 px-4 py-3 text-sm text-[#777b80]">
            <Home size={18} />
            <button type="button" onClick={() => openFolder(null)} className="hover:text-[#2878df]">
              Barcha papkalar
            </button>
            {currentFolder && <span className="text-[#2878df]">› {currentFolder.label}</span>}
          </div>
          {!currentFolder && !query && (
            <div className="divide-y divide-[#eceef0]">
              {folders.map(folder => {
                const count = folder.assets.filter(asset => selectedIds.includes(asset.id)).length;
                return (
                  <button
                    type="button"
                    key={folder.id}
                    onClick={() => openFolder(folder.id)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-[#fafbfc]"
                  >
                    <Folder size={25} className="shrink-0 fill-[#ffca28] text-[#e8a900]" />
                    <span className="flex-1 text-[15px] text-[#25282d]">{folder.label}</span>
                    <span className="text-sm text-[#85898e]">{count}/{folder.total}</span>
                  </button>
                );
              })}
            </div>
          )}
          {query && !currentFolder && (
            <>
              <div className="px-4 py-2 text-xs text-[#777b80]">
                Qidiruv natijalari: {searchResults.length}
              </div>
              <div className="max-h-[65vh] overflow-y-auto">
                {visibleSearchResults.map(asset => (
                  <SymbolRow key={asset.id} asset={asset} selected={selectedIds.includes(asset.id)} onAdd={onAddAsset} />
                ))}
                {searchResults.length === 0 && (
                  <p className="p-6 text-center text-sm text-[#777b80]">Mos aktiv topilmadi</p>
                )}
                {visibleSearchResults.length < searchResults.length && (
                  <button type="button" onClick={() => setVisibleAssetCount(count => count + 50)} className="w-full p-3 text-sm font-medium text-[#2878df]">
                    Yana 50 ta ko‘rsatish
                  </button>
                )}
              </div>
            </>
          )}
          {currentFolder && (
            <div className="max-h-[65vh] overflow-y-auto">
              {visibleFolderAssets.map(asset => (
                <SymbolRow key={asset.id} asset={asset} selected={selectedIds.includes(asset.id)} onAdd={onAddAsset} />
              ))}
              {folderAssets.length === 0 && (
                <p className="p-6 text-center text-sm text-[#777b80]">Mos aktiv topilmadi</p>
              )}
              {visibleFolderAssets.length < folderAssets.length && (
                <button type="button" onClick={() => setVisibleAssetCount(count => count + 50)} className="w-full p-3 text-sm font-medium text-[#2878df]">
                  Yana 50 ta ko‘rsatish
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto">
          {visibleManageAssets.map(asset => {
            const checked = removalSelection.includes(asset.id);
            return (
              <button
                type="button"
                key={asset.id}
                onClick={() => onToggleRemoval(asset.id)}
                aria-pressed={checked}
                className="flex w-full items-center justify-between gap-3 border-b border-[#eceef0] px-4 py-3 text-left"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[#22252a]">{asset.symbol}</span>
                  <span className="block truncate text-xs text-[#777b80]">{asset.name}</span>
                </span>
                <span className={`grid size-6 shrink-0 place-items-center rounded border ${checked ? 'border-[#2878df] bg-[#2878df] text-white' : 'border-[#888d92] text-transparent'}`}>
                  <Check size={16} />
                </span>
              </button>
            );
          })}
          {manageAssets.length === 0 && (
            <p className="p-6 text-center text-sm text-[#777b80]">
              {visibleSelectedAssets.length === 0 ? 'Bu toifada tanlangan aktivlar yo‘q.' : 'Mos aktiv topilmadi.'}
            </p>
          )}
          {visibleManageAssets.length < manageAssets.length && (
            <button type="button" onClick={() => setVisibleAssetCount(count => count + 50)} className="w-full p-3 text-sm font-medium text-[#2878df]">
              Yana 50 ta ko‘rsatish
            </button>
          )}
        </div>
      )}
    </section>
  );
}
