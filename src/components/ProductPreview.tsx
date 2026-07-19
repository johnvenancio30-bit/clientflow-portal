import {
  Check,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  MessageSquareText,
} from "lucide-react";

export function ProductPreview() {
  return (
    <div className="product-preview" aria-label="Preview of the ClientFlow dashboard">
      <div className="preview-topbar">
        <div className="preview-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>app.clientflow.demo</span>
        <span className="preview-secure">Portfolio demo</span>
      </div>
      <div className="preview-app">
        <aside className="preview-sidebar" aria-hidden="true">
          <div className="preview-mini-brand"><span /> CF</div>
          <div className="preview-nav active"><LayoutDashboard size={15} /> Overview</div>
          <div className="preview-nav"><MessageSquareText size={15} /> Requests</div>
          <div className="preview-nav"><FileText size={15} /> Documents</div>
          <div className="preview-nav"><CircleDollarSign size={15} /> Invoices</div>
        </aside>
        <div className="preview-content">
          <div className="preview-heading-row">
            <div>
              <span className="eyebrow">NORTHSTAR STUDIO</span>
              <h3>Website launch</h3>
            </div>
            <span className="status status-progress">In progress</span>
          </div>
          <div className="preview-stats">
            <div><span>Project progress</span><strong>64%</strong></div>
            <div><span>Open requests</span><strong>2</strong></div>
            <div><span>Next invoice</span><strong>$2,040</strong></div>
          </div>
          <div className="preview-grid">
            <section className="preview-panel">
              <div className="panel-title"><span>Milestones</span><small>2 of 4</small></div>
              <div className="preview-progress"><span /></div>
              <div className="preview-task done"><span><Check size={12} /></span><p>Discovery and content map<small>Completed</small></p></div>
              <div className="preview-task current"><span>2</span><p>Visual design approval<small>Due Jul 22</small></p></div>
              <div className="preview-task"><span>3</span><p>Responsive build<small>Due Aug 5</small></p></div>
            </section>
            <section className="preview-panel">
              <div className="panel-title"><span>Recent activity</span><small>Live</small></div>
              <div className="preview-activity"><i className="tone-gold" /><p>Design v3 shared<small>2 hours ago</small></p></div>
              <div className="preview-activity"><i className="tone-blue" /><p>Request moved to review<small>4 hours ago</small></p></div>
              <div className="preview-activity"><i className="tone-green" /><p>Content approved<small>Yesterday</small></p></div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
