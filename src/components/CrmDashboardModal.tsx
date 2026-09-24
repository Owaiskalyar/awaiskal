import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Search, 
  Download, 
  Phone, 
  Mail, 
  Copy, 
  ExternalLink, 
  Building2, 
  Save, 
  Filter, 
  MessageSquare,
  FileUp,
  FileText,
  AlertCircle,
  UploadCloud,
  Trash2,
  Plus,
  FolderArchive,
  Layers,
  FileArchive,
  Check,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import { Lead, BankAccountDetails, LeadStatus, ProductFileInfo } from '../types/crm';
import { leadService } from '../services/leadService';
import { DEFAULT_BANK_DETAILS } from '../data/bankDetails';

interface CrmDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrmDashboardModal: React.FC<CrmDashboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'bank' | 'product' | 'templates'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bankDetails, setBankDetails] = useState<BankAccountDetails>(DEFAULT_BANK_DETAILS);
  const [bankSavedMessage, setBankSavedMessage] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Product Upload State
  const [productInfo, setProductInfo] = useState<ProductFileInfo>({
    filename: 'active-product.pdf',
    originalName: 'Upwork-Client-Acquisition-Master-System.pdf',
    fileSize: '14.2 MB',
    uploadedAt: new Date().toISOString(),
    downloadUrl: '/api/download-product'
  });
  const [productsList, setProductsList] = useState<ProductFileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; currentFileName: string } | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [replacingFileId, setReplacingFileId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Support pressing Escape to close CRM
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadData = async () => {
    const loadedLeads = await leadService.getLeads();
    setLeads(loadedLeads);
    const loadedBank = await leadService.getBankDetails();
    setBankDetails(loadedBank);
    const allProducts = await leadService.getAllProducts();
    setProductsList(allProducts);
    if (allProducts.length > 0) {
      setProductInfo(allProducts[0]);
    } else {
      setProductInfo({
        id: '',
        filename: '',
        originalName: '',
        fileSize: '0 MB',
        uploadedAt: '',
        downloadUrl: ''
      });
    }
  };

  if (!isOpen) return null;

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    await leadService.updateLeadStatus(leadId, newStatus);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    await leadService.saveBankDetails(bankDetails);
    setBankSavedMessage(true);
    setTimeout(() => setBankSavedMessage(false), 3000);
  };

  const handleFilesBatch = async (filesList: File[]) => {
    if (!filesList || filesList.length === 0) return;

    const previousReplaceTarget = replacingFileId;

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccessMessage(null);
      setUploadProgress({ current: 0, total: filesList.length, currentFileName: filesList[0].name });

      const result = await leadService.uploadMultipleFiles(filesList, (curr, total, name) => {
        setUploadProgress({ current: curr, total, currentFileName: name });
      });

      // If replacing a specific target file (e.g. replacing test file with a new file)
      if (previousReplaceTarget && result.successful.length > 0) {
        await leadService.deleteProduct(previousReplaceTarget);
        setReplacingFileId(null);
      }

      const refreshed = await leadService.getAllProducts();
      setProductsList(refreshed);
      if (refreshed.length > 0) {
        setProductInfo(refreshed[0]);
      }

      if (result.successful.length > 0) {
        const msg = previousReplaceTarget
          ? `File replaced with "${result.successful[0].originalName}"! New file is live and ready for testing.`
          : filesList.length === 1 
            ? `File "${result.successful[0].originalName}" (${result.successful[0].fileSize}) successfully uploaded and ready for testing!`
            : `All ${result.successful.length} file(s) successfully uploaded and live for your buyers!`;
        setUploadSuccessMessage(msg);
        setTimeout(() => setUploadSuccessMessage(null), 6000);
      }

      if (result.failed.length > 0) {
        setUploadError(`Failed to upload ${result.failed.length} file(s): ${result.failed.map(f => f.name).join(', ')}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      setReplacingFileId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFilesBatch(files);
  };

  const handleStartReplace = (fileId: string) => {
    replaceTargetIdRef.current = fileId;
    setReplacingFileId(fileId);
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
      replaceFileInputRef.current.click();
    }
  };

  const handleReplaceFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = replaceTargetIdRef.current;
    if (!file || !targetId) {
      setReplacingFileId(null);
      replaceTargetIdRef.current = null;
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccessMessage(null);
      setUploadProgress({ current: 0, total: 1, currentFileName: file.name });

      const result = await leadService.replaceProductFile(targetId, file);
      const refreshed = await leadService.getAllProducts();
      setProductsList(refreshed);
      if (refreshed.length > 0) {
        setProductInfo(refreshed[0]);
      }

      setUploadSuccessMessage(`Successfully replaced file with "${file.name}" (${result.product.fileSize})! Live and ready to test download.`);
      setTimeout(() => setUploadSuccessMessage(null), 6000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to replace product file';
      setUploadError(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      replaceTargetIdRef.current = null;
      setReplacingFileId(null);
      if (replaceFileInputRef.current) {
        replaceFileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    try {
      setDeletingId(id);
      setPendingDeleteId(null);
      const remaining = await leadService.deleteProduct(id);
      setProductsList(remaining);
      if (remaining.length > 0) {
        setProductInfo(remaining[0]);
      } else {
        setProductInfo({
          id: '',
          filename: '',
          originalName: '',
          fileSize: '0 MB',
          uploadedAt: '',
          downloadUrl: ''
        });
      }
      const isTest = id === 'prod_master_pdf' || name.toLowerCase().includes('acquisition-master');
      setUploadSuccessMessage(
        isTest 
          ? `Test product "${name}" deleted successfully. You can now upload a different file for testing.`
          : `"${name}" removed from product files.`
      );
      setTimeout(() => setUploadSuccessMessage(null), 5000);
    } catch {
      setUploadError(`Could not delete "${name}"`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestoreDefault = async () => {
    try {
      setIsUploading(true);
      setUploadError(null);
      const restored = await leadService.resetDefaultProduct();
      setProductsList(restored);
      if (restored.length > 0) {
        setProductInfo(restored[0]);
      }
      setUploadSuccessMessage('Default sample test product restored successfully.');
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    } catch {
      setUploadError('Failed to restore default product');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestDownloadAll = async () => {
    try {
      setIsDownloadingAll(true);
      await leadService.downloadAllFiles(productsList);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = statusFilter === 'all' || lead.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.referenceId.toLowerCase().includes(query) ||
      lead.niche.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  // Calculate Metrics
  const totalLeads = leads.length;
  const paidCount = leads.filter(l => l.status === 'paid').length;
  const pendingWireCount = leads.filter(l => l.status === 'pending_bank_transfer').length;
  const abandonedCount = leads.filter(l => l.status === 'abandoned_lead').length;
  const paidRevenue = leads
    .filter(l => l.status === 'paid')
    .reduce((sum, l) => sum + (l.amount || 0), 0);
  const pipelineValue = leads
    .filter(l => l.status === 'abandoned_lead' || l.status === 'pending_bank_transfer')
    .reduce((sum, l) => sum + (l.amount || 0), 0);

  const exportToCsv = () => {
    const headers = ['Reference', 'Name', 'Email', 'Phone', 'Niche', 'Tier', 'Amount', 'Payment Method', 'Status', 'Date', 'Bank Tx Ref'];
    const rows = leads.map(l => [
      `"${l.referenceId}"`,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.niche}"`,
      `"${l.tierName}"`,
      `"$${l.amount}"`,
      `"${l.paymentMethod}"`,
      `"${l.status}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
      `"${l.bankTransactionRef || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `upwork-leads-crm-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getWhatsAppLink = (lead: Lead) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hi ${lead.name.split(' ')[0]}! This is Awais regarding the Client Acquisition System on Upwork. I noticed you checked out the ${lead.tierName}. Did you have any questions about landing high-ticket clients or need help setting up?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const getMailtoLink = (lead: Lead) => {
    const subject = encodeURIComponent(`Exclusive Follow-up: Your Upwork Client Acquisition System Access`);
    const body = encodeURIComponent(
      `Hi ${lead.name},\n\nI saw you were considering the ${lead.tierName} for your ${lead.niche} freelance business.\n\nDid you run into any questions about the 15 proposal swipe files or the Profile Optimization Framework?\n\nI'd love to help you get started or arrange your preferred payment method.\n\nBest,\nAwais Ahmad`
    );
    return `mailto:${lead.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">Merchant CRM & Product Hub</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                  Private Admin
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Track leads, upload your product PDF, configure bank details, and retarget abandoned visitors.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-800"
            title="Return to main page (Esc)"
          >
            <span className="text-xs font-semibold">Exit</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-neutral-950/60 px-6 py-2 border-b border-neutral-800/80 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'leads'
                  ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Leads ({totalLeads})</span>
            </button>

            <button
              onClick={() => setActiveTab('product')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'product'
                  ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Product Files ({productsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bank')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bank'
                  ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bank Account Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Retargeting Scripts</span>
            </button>
          </div>

          {activeTab === 'leads' && (
            <button
              onClick={exportToCsv}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Export all leads to CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* TAB: UPLOAD PRODUCT (MULTI-FILE VAULT) */}
        {activeTab === 'product' && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1 max-w-3xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-emerald-400" />
                  <span>Digital Product Files & Test Product</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Upload, test, replace, or delete your product files. Delete the test product to upload a different test file or your own guides.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
                </button>

                {productsList.length > 1 && (
                  <button
                    type="button"
                    disabled={isDownloadingAll}
                    onClick={handleTestDownloadAll}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-700"
                    title="Test download every file in the bundle"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isDownloadingAll ? 'Downloading...' : 'Test All'}</span>
                  </button>
                )}

                {(!productsList.some(p => p.id === 'prod_master_pdf' || p.originalName.toLowerCase().includes('acquisition-master')) || productsList.length === 0) && (
                  <button
                    type="button"
                    onClick={handleRestoreDefault}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-800"
                    title="Restore default sample test product"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Restore Sample File</span>
                  </button>
                )}
              </div>
            </div>

            {/* Feedback Notifications */}
            {uploadSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Progress Bar if batch uploading */}
            {uploadProgress && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-emerald-500/50 space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    Uploading file {uploadProgress.current + 1} of {uploadProgress.total}...
                  </span>
                  <span className="text-neutral-400 truncate max-w-xs">{uploadProgress.currentFileName}</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-1.5 transition-all duration-300"
                    style={{ width: `${Math.round(((uploadProgress.current + 1) / uploadProgress.total) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* List of Current Product Files */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Files in Product Bundle ({productsList.length})</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  Live for Buyers
                </span>
              </div>

              {productsList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h4 className="text-sm font-bold text-white">Test Product Removed</h4>
                    <p className="text-xs text-neutral-400">
                      No files currently uploaded. You can now upload a different file to use as your test file or product package for your buyers.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Different File</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRestoreDefault}
                      className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-800"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Restore Default Test Product</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {productsList.map((file, idx) => {
                    const ext = (file.originalName.split('.').pop() || 'PDF').toUpperCase();
                    const isTestProduct = file.id === 'prod_master_pdf' || file.originalName.toLowerCase().includes('acquisition-master');
                    const isConfirmingDelete = pendingDeleteId === file.id;

                    return (
                      <div 
                        key={file.id || `file-${idx}`}
                        className={`p-3.5 sm:p-4 rounded-2xl bg-neutral-950 border transition-all ${
                          isConfirmingDelete 
                            ? 'border-rose-500/60 bg-rose-950/20' 
                            : isTestProduct 
                              ? 'border-amber-500/30 hover:border-amber-500/50' 
                              : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 truncate min-w-0">
                            <div className={`w-10 h-10 rounded-xl border flex flex-col items-center justify-center shrink-0 ${
                              isTestProduct 
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                : 'bg-neutral-900 border-neutral-800 text-emerald-400'
                            }`}>
                              <FileText className="w-4 h-4" />
                              <span className="text-[9px] font-black font-mono mt-0.5">{ext.slice(0, 4)}</span>
                            </div>
                            <div className="truncate">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white truncate" title={file.originalName}>
                                  {file.originalName}
                                </span>
                                {isTestProduct && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
                                    🧪 Test Product
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                                <span>Size: {file.fileSize}</span>
                                <span>•</span>
                                <span>Uploaded: {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Active'}</span>
                                {isTestProduct && (
                                  <>
                                    <span>•</span>
                                    <span className="text-amber-400/80">Can be deleted to upload a different file</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            {isConfirmingDelete ? (
                              <div className="flex items-center gap-1.5 bg-neutral-900 border border-rose-500/50 p-1.5 rounded-xl animate-fade-in">
                                <span className="text-xs text-rose-300 font-bold px-2">
                                  {isTestProduct ? 'Delete test product?' : 'Delete this file?'}
                                </span>
                                <button
                                  type="button"
                                  disabled={deletingId === file.id}
                                  onClick={() => handleDeleteProduct(file.id!, file.originalName)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {deletingId === file.id ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPendingDeleteId(null)}
                                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                {/* Test Download */}
                                <button
                                  type="button"
                                  onClick={() => leadService.triggerProductDownload(file.downloadUrl, file.originalName, file.id)}
                                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-800"
                                  title="Test download what your buyers receive"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Test</span>
                                </button>

                                {/* Replace file with a different file */}
                                <button
                                  type="button"
                                  disabled={isUploading || deletingId === file.id}
                                  onClick={() => handleStartReplace(file.id!)}
                                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-800 disabled:opacity-50"
                                  title="Upload a different file to replace this file"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${replacingFileId === file.id ? 'animate-spin text-emerald-400' : ''}`} />
                                  <span className="hidden sm:inline">{replacingFileId === file.id ? 'Replacing...' : 'Replace'}</span>
                                </button>

                                {/* Delete file button - ALWAYS accessible, even if only 1 file / test file */}
                                {file.id && (
                                  <button
                                    type="button"
                                    disabled={deletingId === file.id || isUploading}
                                    onClick={() => setPendingDeleteId(file.id!)}
                                    className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer border border-neutral-800 hover:border-rose-900/60 flex items-center gap-1.5 disabled:opacity-50"
                                    title={isTestProduct ? "Delete test product so you can upload a different file" : "Delete file"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                    <span className="text-xs font-semibold text-rose-400/90 hidden sm:inline">Delete</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Hidden dedicated file input for atomic replacement */}
            <input
              ref={replaceFileInputRef}
              type="file"
              accept=".pdf,.zip,.epub,.docx,.txt,.xlsx,.csv,application/pdf,application/zip,application/*"
              onChange={handleReplaceFileSelected}
              className="hidden"
            />

            {/* Upload Dropzone / Multi-File Picker */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFilesBatch(Array.from(e.dataTransfer.files));
                }
              }}
              className="p-8 border-2 border-dashed border-neutral-700 hover:border-emerald-400 bg-neutral-950/70 hover:bg-neutral-950 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.zip,.epub,.docx,.txt,.xlsx,.csv,application/pdf,application/zip,application/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-neutral-900 group-hover:bg-emerald-500/20 text-neutral-400 group-hover:text-emerald-400 flex items-center justify-center transition-colors">
                {isUploading ? (
                  <span className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {isUploading ? 'Uploading & Securing Files...' : 'Select or drop all your files here'}
                </div>
                <p className="text-xs text-neutral-400 max-w-sm">
                  Select <strong>multiple files at once</strong> (PDFs, ZIPs, DOCX, workbooks). Up to 100 MB per file.
                </p>
              </div>

              <button
                type="button"
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer transition-colors"
              >
                {isUploading ? 'Uploading Files...' : 'Browse & Select Multiple Files'}
              </button>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-1.5">
              <span className="font-bold text-white block">💡 Multi-File Bundle Features:</span>
              <p>
                • <strong>Upload multiple files at once:</strong> Select all your PDFs, swipe files, or bonus templates together in the file browser.
              </p>
              <p>
                • <strong>Instant Buyer Access:</strong> Customers who purchase or verify payment will see all your files listed cleanly with individual download buttons as well as a "Download All" option.
              </p>
              <p>
                • <strong>Bulletproof Storage:</strong> Files are stored both in the system downloads vault and in your browser's IndexedDB vault for reliable delivery.
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Leads and Customers */}
        {activeTab === 'leads' && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-[11px] text-neutral-400 font-semibold uppercase">Total Leads Captured</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">{totalLeads}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Contacts ready for outreach</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-500/30">
                <div className="text-[11px] text-emerald-400 font-semibold uppercase">Paid Customers</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 font-mono">
                  {paidCount} <span className="text-xs font-normal text-neutral-400">(${paidRevenue})</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Cleared & confirmed orders</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-amber-500/30">
                <div className="text-[11px] text-amber-400 font-semibold uppercase">Pending Bank Wire</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1 font-mono">{pendingWireCount}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Awaiting payment verification</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-rose-500/20">
                <div className="text-[11px] text-rose-300 font-semibold uppercase">Abandoned Carts</div>
                <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1 font-mono">
                  {abandonedCount} <span className="text-xs font-normal text-neutral-400">(${pipelineValue})</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">High-intent retargeting pool</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or order reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
                <Filter className="w-3.5 h-3.5 text-neutral-500 ml-1 mr-1" />
                {[
                  { id: 'all', label: 'All' },
                  { id: 'abandoned_lead', label: 'Abandoned Carts' },
                  { id: 'pending_bank_transfer', label: 'Pending Wire' },
                  { id: 'paid', label: 'Paid' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table */}
            <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900/80 text-neutral-400 font-semibold border-b border-neutral-800 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Contact & Name</th>
                      <th className="py-3 px-4">Phone / WhatsApp</th>
                      <th className="py-3 px-4">Package & Value</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Retargeting Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-500">
                          No leads matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-xs">{lead.name}</div>
                            <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                              <span>{lead.email}</span>
                              <button
                                onClick={() => copyText(lead.email, `email-${lead.id}`)}
                                className="text-neutral-500 hover:text-emerald-400 cursor-pointer"
                                title="Copy Email"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              Ref: <span className="font-mono text-neutral-400">{lead.referenceId}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {lead.phone && lead.phone !== 'Not provided' ? (
                              <div className="flex items-center gap-1.5 text-emerald-300">
                                <Phone className="w-3 h-3" />
                                <span>{lead.phone}</span>
                                <button
                                  onClick={() => copyText(lead.phone, `phone-${lead.id}`)}
                                  className="text-neutral-500 hover:text-emerald-400 cursor-pointer"
                                  title="Copy Phone"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-neutral-600 italic">No phone entered</span>
                            )}
                            <div className="text-[10px] text-neutral-400 mt-0.5">{lead.niche}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white truncate max-w-[130px]">{lead.tierName}</div>
                            <div className="text-emerald-400 font-mono font-bold">${lead.amount}.00</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                lead.status === 'paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : lead.status === 'pending_bank_transfer'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              }`}
                            >
                              <option value="paid" className="bg-neutral-900 text-emerald-400">✓ Paid / Cleared</option>
                              <option value="pending_bank_transfer" className="bg-neutral-900 text-amber-400">⏳ Pending Wire</option>
                              <option value="abandoned_lead" className="bg-neutral-900 text-rose-400">⚠️ Abandoned Cart</option>
                            </select>

                            {lead.bankTransactionRef && (
                              <div className="text-[10px] text-amber-300/90 mt-1 font-mono truncate max-w-[120px]" title={lead.bankTransactionRef}>
                                Tx: {lead.bankTransactionRef}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            <div className="text-[10px] text-neutral-500">
                              {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {lead.phone && lead.phone !== 'Not provided' && (
                                <a
                                  href={getWhatsAppLink(lead)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                  title="Open WhatsApp chat with prefilled retargeting offer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                              )}

                              <a
                                href={getMailtoLink(lead)}
                                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                                title="Send retargeting email"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bank Account Settings */}
        {activeTab === 'bank' && (
          <form onSubmit={handleSaveBank} className="p-6 space-y-5 overflow-y-auto flex-1 max-w-2xl mx-auto w-full">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Your Bank Account Configuration</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Update your bank account information here. These details will immediately display inside the checkout modal whenever a customer selects "Bank Wire Transfer".
              </p>
            </div>

            {bankSavedMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Bank details successfully updated and saved!</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Bank Name:
                </label>
                <input
                  type="text"
                  required
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="e.g. Standard Chartered / Meezan Bank / Chase"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Account Title / Beneficiary Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={bankDetails.accountTitle}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountTitle: e.target.value })}
                    placeholder="e.g. Awais Ahmad"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Account Number:
                  </label>
                  <input
                    type="text"
                    required
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    placeholder="e.g. 01234567890123"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    IBAN (International Bank Account Number):
                  </label>
                  <input
                    type="text"
                    value={bankDetails.iban}
                    onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
                    placeholder="e.g. PK36MEZN0001234567890123"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    SWIFT / BIC Code:
                  </label>
                  <input
                    type="text"
                    value={bankDetails.swiftCode}
                    onChange={(e) => setBankDetails({ ...bankDetails, swiftCode: e.target.value })}
                    placeholder="e.g. MEZNPKKA"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Branch City / Address:
                </label>
                <input
                  type="text"
                  value={bankDetails.branchCity}
                  onChange={(e) => setBankDetails({ ...bankDetails, branchCity: e.target.value })}
                  placeholder="e.g. Lahore, Pakistan"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Customer Instructions (Shown in Checkout):
                </label>
                <textarea
                  rows={3}
                  value={bankDetails.instructions}
                  onChange={(e) => setBankDetails({ ...bankDetails, instructions: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl p-3 text-xs text-neutral-300 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Bank Details</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 3: Retargeting Templates */}
        {activeTab === 'templates' && (
          <div className="p-6 space-y-5 overflow-y-auto flex-1 max-w-3xl mx-auto w-full text-xs">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Battle-Tested Retargeting Follow-Up Scripts</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Use these scripts to convert abandoned cart leads into paying customers within 24 hours of them viewing the system.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">Script #1: WhatsApp Follow-Up (Within 1 Hour)</span>
                <button
                  onClick={() => copyText(
                    "Hey [Name], noticed you were looking at the Upwork Client Acquisition System for your [Niche] freelance business! Did you have any questions about the 15 proposal swipe files or need help with bank payment? Happy to help you get access.",
                    'script-1'
                  )}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'script-1' ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <div className="bg-neutral-900 p-3 rounded-xl text-neutral-300 font-mono text-[11px] leading-relaxed">
                "Hey [Name], noticed you were looking at the Upwork Client Acquisition System for your [Niche] freelance business! Did you have any questions about the 15 proposal swipe files or need help with bank payment? Happy to help you get access."
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">Script #2: Pending Bank Transfer Slip Reminder</span>
                <button
                  onClick={() => copyText(
                    "Hi [Name], we reserved your order reference [Reference-ID] for the Client Acquisition System. Whenever you send the bank transfer, please reply with your screenshot or transaction ID so we can instantly unlock your Notion workspace and video audits!",
                    'script-2'
                  )}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'script-2' ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <div className="bg-neutral-900 p-3 rounded-xl text-neutral-300 font-mono text-[11px] leading-relaxed">
                "Hi [Name], we reserved your order reference [Reference-ID] for the Client Acquisition System. Whenever you send the bank transfer, please reply with your screenshot or transaction ID so we can instantly unlock your Notion workspace and video audits!"
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">Script #3: 24-Hour Final Urgency Nudge</span>
                <button
                  onClick={() => copyText(
                    "Hey [Name], quick heads-up: our 75% launch pricing for the Upwork System ends tonight. If you want to stop burning connects on ghost jobs and start landing $3,000+ contracts this month, here is the direct link to claim your system: [Link]",
                    'script-3'
                  )}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'script-3' ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <div className="bg-neutral-900 p-3 rounded-xl text-neutral-300 font-mono text-[11px] leading-relaxed">
                "Hey [Name], quick heads-up: our 75% launch pricing for the Upwork System ends tonight. If you want to stop burning connects on ghost jobs and start landing $3,000+ contracts this month, here is the direct link to claim your system: [Link]"
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
