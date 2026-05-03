/**
 * ═══════════════════════════════════════════════════════
 *   EXCEL SYNC MODULE
 *   Exports MongoDB/JSON data to Excel in real-time
 * ═══════════════════════════════════════════════════════
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

class ExcelSync {
  constructor(dbConnector) {
    this.dbConnector = dbConnector;
    this.excelPath = path.join(__dirname, 'database-sync.xlsx');
    this.isScheduled = false;
    this.pendingSync = false;
    this.syncQueue = null;
  }

  /**
   * Initialize Excel sync - create file and set up real-time updates
   */
  async initialize() {
    console.log('📊 Initializing Real-Time Excel Sync...');
    
    // Create initial Excel file
    await this.exportToExcel();
    
    // Schedule debounced syncs for high-frequency changes (max 1 sync per second)
    if (!this.isScheduled) {
      schedule.scheduleJob('* * * * * *', async () => { // Every second
        if (this.pendingSync) {
          await this.exportToExcel();
          this.pendingSync = false;
        }
      });
      this.isScheduled = true;
      console.log('✅ Real-Time Excel Sync Active - Updates on every database change');
    }
  }

  /**
   * Trigger Excel sync on data changes
   */
  triggerSync() {
    this.pendingSync = true;
  }

  /**
   * Export all database data to Excel
   */
  async exportToExcel() {
    try {
      const startTime = Date.now();
      const workbook = new ExcelJS.Workbook();
      
      // Get data from all collections
      const data = this.dbConnector();
      
      // Create sheets for each collection (parallel)
      await Promise.all([
        this.createUsersSheet(workbook, data.users),
        this.createOrdersSheet(workbook, data.orders),
        this.createInvoicesSheet(workbook, data.invoices),
        this.createActivitiesSheet(workbook, data.activities),
        this.createSessionsSheet(workbook, data.sessions),
        this.createMessagesSheet(workbook, data.messages),
        this.createWorkItemsSheet(workbook, data.works),
        this.createDashboardSheet(workbook, data)
      ]);
      
      // Write to file
      await workbook.xlsx.writeFile(this.excelPath);
      const duration = Date.now() - startTime;
      console.log(`✅ [${new Date().toLocaleTimeString()}] Excel updated in ${duration}ms`);
      
    } catch (error) {
      console.error('❌ Excel sync error:', error.message);
    }
  }

  /**
   * Create Users Sheet
   */
  async createUsersSheet(workbook, users) {
    const sheet = workbook.addWorksheet('Users');
    
    sheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Company', key: 'company', width: 20 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Status', key: 'isActive', width: 10 },
      { header: 'Total Orders', key: 'totalOrders', width: 12 },
      { header: 'Total Spent (₹)', key: 'totalSpent', width: 15 },
      { header: 'Last Login', key: 'lastLogin', width: 20 },
      { header: 'Joined Date', key: 'createdAt', width: 20 },
    ];

    users.forEach(user => {
      sheet.addRow({
        _id: user._id || user.id || 'N/A',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        role: user.role || 'client',
        isActive: user.isActive ? 'Active' : 'Inactive',
        totalOrders: user.totalOrders || 0,
        totalSpent: user.totalSpent || 0,
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never',
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : '',
      });
    });

    // Style header row
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };
  }

  /**
   * Create Orders Sheet
   */
  async createOrdersSheet(workbook, orders) {
    const sheet = workbook.addWorksheet('Orders');
    
    sheet.columns = [
      { header: 'Order ID', key: '_id', width: 25 },
      { header: 'Client Name', key: 'userName', width: 20 },
      { header: 'Client Email', key: 'userEmail', width: 25 },
      { header: 'Service Type', key: 'serviceType', width: 20 },
      { header: 'Title', key: 'title', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Budget (₹)', key: 'budget', width: 12 },
      { header: 'Final Price (₹)', key: 'finalPrice', width: 12 },
      { header: 'Paid Amount (₹)', key: 'paymentPaid', width: 12 },
      { header: 'Deadline', key: 'deadline', width: 20 },
      { header: 'Completion Date', key: 'completionDate', width: 20 },
      { header: 'Assigned To', key: 'assigneeName', width: 20 },
      { header: 'Created Date', key: 'createdAt', width: 20 },
    ];

    orders.forEach(order => {
      sheet.addRow({
        _id: order._id || order.id || 'N/A',
        userName: order.userName || '',
        userEmail: order.userEmail || '',
        serviceType: order.serviceType || '',
        title: order.title || '',
        status: order.status || 'pending',
        priority: order.priority || 'medium',
        budget: order.budget || 0,
        finalPrice: order.finalPrice || 0,
        paymentPaid: (order.payment?.advancePaidAmount || 0) + (order.payment?.remainingPaidAmount || 0),
        deadline: order.deadline ? new Date(order.deadline).toLocaleDateString() : '',
        completionDate: order.completionDate ? new Date(order.completionDate).toLocaleDateString() : '',
        assigneeName: order.assigneeName || '',
        createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString() : '',
      });
    });

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };
  }

  /**
   * Create Invoices Sheet
   */
  async createInvoicesSheet(workbook, invoices) {
    const sheet = workbook.addWorksheet('Invoices');
    
    sheet.columns = [
      { header: 'Invoice #', key: 'invoiceNumber', width: 15 },
      { header: 'Client Name', key: 'clientName', width: 20 },
      { header: 'Client Email', key: 'clientEmail', width: 25 },
      { header: 'Amount (₹)', key: 'amount', width: 12 },
      { header: 'Paid Amount (₹)', key: 'paidAmount', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Issue Date', key: 'issueDate', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Paid Date', key: 'paidAt', width: 15 },
      { header: 'Payment Method', key: 'paymentMethod', width: 15 },
    ];

    invoices.forEach(invoice => {
      sheet.addRow({
        invoiceNumber: invoice.invoiceNumber || '',
        clientName: invoice.clientName || '',
        clientEmail: invoice.clientEmail || '',
        amount: invoice.amount || 0,
        paidAmount: invoice.paidAmount || 0,
        status: invoice.status || 'draft',
        issueDate: invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : '',
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '',
        paidAt: invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : '',
        paymentMethod: invoice.paymentMethod || '',
      });
    });

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };
  }

  /**
   * Create Activities Sheet
   */
  async createActivitiesSheet(workbook, activities) {
    const sheet = workbook.addWorksheet('Activities');
    
    sheet.columns = [
      { header: 'Activity ID', key: '_id', width: 25 },
      { header: 'User', key: 'userName', width: 20 },
      { header: 'Email', key: 'userEmail', width: 25 },
      { header: 'Activity Type', key: 'activityType', width: 20 },
      { header: 'Description', key: 'description', width: 35 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'IP Address', key: 'ipAddress', width: 15 },
      { header: 'Timestamp', key: 'createdAt', width: 25 },
    ];

    // Show last 1000 activities (most recent first)
    const recentActivities = Array.isArray(activities) ? activities.slice().reverse().slice(0, 1000) : [];
    recentActivities.forEach(activity => {
      sheet.addRow({
        _id: activity._id || activity.id || 'N/A',
        userName: activity.userName || '',
        userEmail: activity.userEmail || '',
        activityType: activity.activityType || 'other',
        description: activity.description || '',
        status: activity.status || 'success',
        ipAddress: activity.ipAddress || 'N/A',
        createdAt: activity.createdAt ? new Date(activity.createdAt).toLocaleString() : new Date().toLocaleString(),
      });
    });

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };
  }

  /**
   * Create Sessions Sheet
   */
  async createSessionsSheet(workbook, sessions) {
    const sheet = workbook.addWorksheet('Sessions');
    
    sheet.columns = [
      { header: 'Session ID', key: '_id', width: 25 },
      { header: 'User Email', key: 'userEmail', width: 25 },
      { header: 'IP Address', key: 'ipAddress', width: 15 },
      { header: 'User Agent', key: 'userAgent', width: 35 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Expires At', key: 'expiresAt', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    sessions.forEach(session => {
      sheet.addRow({
        _id: session._id || session.id || 'N/A',
        userEmail: session.userEmail || '',
        ipAddress: session.ipAddress || 'N/A',
        userAgent: session.userAgent || 'N/A',
        status: session.revokedAt ? 'Revoked' : 'Active',
        expiresAt: session.expiresAt ? new Date(session.expiresAt).toLocaleString() : '',
        createdAt: session.createdAt ? new Date(session.createdAt).toLocaleString() : '',
      });
    });

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };
  }

  /**
   * Create Messages Sheet
   */
  async createMessagesSheet(workbook, messages) {
    const sheet = workbook.addWorksheet('Messages');
    
    sheet.columns = [
      { header: 'Message ID', key: '_id', width: 25 },
      { header: 'Client ID', key: 'clientId', width: 25 },
      { header: 'Sender', key: 'senderName', width: 20 },
      { header: 'Sender Role', key: 'senderRole', width: 15 },
      { header: 'Message Type', key: 'type', width: 12 },
      { header: 'Message', key: 'message', width: 40 },
      { header: 'Meeting Link', key: 'meetingLink', width: 30 },
      { header: 'Timestamp', key: 'createdAt', width: 20 },
    ];

    messages.forEach(msg => {
      sheet.addRow({
        _id: msg._id || msg.id || 'N/A',
        clientId: msg.clientId || '',
        senderName: msg.senderName || '',
        senderRole: msg.senderRole || '',
        type: msg.type || 'text',
        message: msg.message ? msg.message.substring(0, 100) : '',
        meetingLink: msg.meetingLink || '',
        createdAt: msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '',
      });
    });

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };
  }

  /**
   * Create WorkItems Sheet
   */
  async createWorkItemsSheet(workbook, workItems) {
    const sheet = workbook.addWorksheet('WorkItems');
    
    sheet.columns = [
      { header: 'Work ID', key: '_id', width: 25 },
      { header: 'Client Name', key: 'clientName', width: 20 },
      { header: 'Client Email', key: 'clientEmail', width: 25 },
      { header: 'Service Type', key: 'serviceType', width: 20 },
      { header: 'Title', key: 'title', width: 25 },
      { header: 'Summary', key: 'summary', width: 40 },
      { header: 'Is Public', key: 'isPublic', width: 10 },
      { header: 'Created By', key: 'createdBy', width: 20 },
      { header: 'Created Date', key: 'createdAt', width: 20 },
    ];

    workItems.forEach(work => {
      sheet.addRow({
        _id: work._id || work.id || 'N/A',
        clientName: work.clientName || '',
        clientEmail: work.clientEmail || '',
        serviceType: work.serviceType || '',
        title: work.title || '',
        summary: work.summary ? work.summary.substring(0, 50) : '',
        isPublic: work.isPublic ? 'Yes' : 'No',
        createdBy: work.createdBy || '',
        createdAt: work.createdAt ? new Date(work.createdAt).toLocaleString() : '',
      });
    });

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };
  }

  /**
   * Create Dashboard Summary Sheet
   */
  async createDashboardSheet(workbook, data) {
    const sheet = workbook.addWorksheet('Dashboard', { properties: { tabColor: { theme: 9 } } });
    
    // Calculate stats
    const totalUsers = (data.users || []).length;
    const totalOrders = (data.orders || []).length;
    const totalInvoices = (data.invoices || []).length;
    const totalActivities = (data.activities || []).length;
    
    const pendingOrders = (data.orders || []).filter(o => o.status === 'pending').length;
    const inProgressOrders = (data.orders || []).filter(o => o.status === 'in_progress').length;
    const completedOrders = (data.orders || []).filter(o => o.status === 'completed').length;
    
    const totalRevenue = (data.invoices || []).reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const pendingRevenue = (data.invoices || []).reduce((sum, inv) => {
      if (inv.status === 'pending' || inv.status === 'sent') return sum + (inv.amount - (inv.paidAmount || 0));
      return sum;
    }, 0);

    const recentActivity = (data.activities || []).slice(-1)[0];

    sheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 },
    ];

    const metrics = [
      { metric: '📊 DASHBOARD SUMMARY', value: new Date().toLocaleString() },
      { metric: '', value: '' },
      { metric: '👥 Total Users', value: totalUsers },
      { metric: '📋 Total Orders', value: totalOrders },
      { metric: '   ├─ Pending', value: pendingOrders },
      { metric: '   ├─ In Progress', value: inProgressOrders },
      { metric: '   └─ Completed', value: completedOrders },
      { metric: '💰 Total Revenue (₹)', value: totalRevenue.toLocaleString('en-IN') },
      { metric: '⏳ Pending Revenue (₹)', value: pendingRevenue.toLocaleString('en-IN') },
      { metric: '📄 Total Invoices', value: totalInvoices },
      { metric: '🔔 Total Activities Logged', value: totalActivities },
      { metric: '', value: '' },
      { metric: '⏱️  Last Activity', value: recentActivity ? new Date(recentActivity.createdAt).toLocaleString() : 'N/A' },
      { metric: '🔄 Last Excel Update', value: new Date().toLocaleString() },
    ];

    metrics.forEach(m => {
      sheet.addRow(m);
    });

    // Style
    sheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF1F4E78' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
  }

  /**
   * Get Excel file path
   */
  getFilePath() {
    return this.excelPath;
  }
}

module.exports = ExcelSync;
