export function ContactInfo() {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Email
          </p>
          <a
            href="mailto:hello@elevationdesign.co"
            className="text-lg text-primary hover:text-accent transition-colors"
          >
            hello@elevationdesign.co
          </a>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Phone
          </p>
          <a
            href="tel:+13035550123"
            className="text-lg text-gray-900 no-underline hover:text-primary transition-colors"
          >
            (303) 555-0123
          </a>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
            Address
          </p>
          <p className="text-lg text-gray-900">
            1234 Design District
            <br />
            Denver, CO 80202
          </p>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Hours
          </p>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Monday &ndash; Friday</span>
              <span className="font-medium">9am &ndash; 6pm</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span className="font-medium">By appointment</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span className="font-medium">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
