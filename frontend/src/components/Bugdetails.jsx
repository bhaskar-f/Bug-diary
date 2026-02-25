import Leftnav from "./Leftnav";
import Topnav from "./Topnav";

function Section({ title, children }) {
  return (
    <div className="space-y-2 last:mb-15">
      <h3 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
        {title}
      </h3>
      <div className="bg-white px-2">{children}</div>
    </div>
  );
}

function ActionsCard() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
      <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg transition">
        Edit Bug
      </button>

      <button className="w-full border border-zinc-300 hover:bg-zinc-50 text-zinc-800 font-medium py-2.5 rounded-lg transition">
        Mark as Resolved
      </button>

      <button className="w-full border border-red-300 hover:bg-red-50 text-red-600 font-medium py-2.5 rounded-lg transition">
        Close & Archive
      </button>
    </div>
  );
}
function DetailsCard() {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5">
      <h3 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-4">
        Details
      </h3>

      <div className="space-y-3 text-sm mt-5">
        <DetailRow label="Status">
          <span className="inline-flex items-center gap-2 px-2 py-1 rounded-lg text-[.75rem] border border-violet-200 bg-violet-50 text-violet-700">
            <span className="w-[7px] h-[7px] rounded-full bg-violet-500"></span>
            Open
          </span>
        </DetailRow>

        <DetailRow label="Priority">
          <span className="inline-flex items-center gap-2 px-2 py-1 rounded-lg text-[.75rem] border border-orange-200 bg-orange-50 text-orange-700">
            <span className="w-[7px] h-[7px]  rounded-full bg-orange-500"></span>
            High
          </span>
        </DetailRow>

        <DetailRow label="Environment">
          <span className="text-zinc-800">Production</span>
        </DetailRow>

        <DetailRow label="Area">
          <span className="text-zinc-800">Auth</span>
        </DetailRow>

        <DetailRow label="Created On">
          <span className="text-zinc-800">Dec 14, 2025</span>
        </DetailRow>
        <DetailRow label="Last Updated">
          <span className="text-zinc-800">3 days ago</span>
        </DetailRow>

        <DetailRow label="owner">
          <div className="flex items-center gap-2 ">
            <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-semibold">
              U
            </span>
            <span>@username</span>
          </div>
        </DetailRow>
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-center justify-between -mt-3 py-1.5 border-b-1 border-zinc-200 last:border-b-0">
      <span className="text-zinc-500">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}

function RelatedBugsCard() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <h3 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-4">
        Related Bugs
      </h3>

      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2 text-zinc-700 hover:text-violet-600 cursor-pointer">
          <span className="mt-1 w-2 h-2 rounded-full bg-orange-500"></span>
          Signup form same issue on Firefox
        </li>

        <li className="flex items-start gap-2 text-zinc-700 hover:text-violet-600 cursor-pointer">
          <span className="mt-1 w-2 h-2 rounded-full bg-violet-500"></span>
          Password reset button no response
        </li>

        <li className="flex items-start gap-2 text-zinc-700 hover:text-violet-600 cursor-pointer">
          <span className="mt-1 w-2 h-2 rounded-full bg-slate-400"></span>
          Touch events passive listener docs
        </li>
      </ul>
    </div>
  );
}

export default function Bugdetails() {
  return (
    <div className="w-screen h-screen flex">
      <Leftnav />
      <div className="w-[80%] h-full flex flex-col">
        <Topnav />
        <div className="p-8  overflow-y-auto">
          {/* Breadcrumb */}
          <div className="flex  items-center gap-1.5">
            <a
              href="/"
              className={`text-sm transition-colors hover:text-violet-600 text-zinc-400`}
            >
              Home
            </a>
            <span className={`text-sm text-zinc-400`}>/</span>
            <span className={`text-sm font-medium text-zinc-300}`}>
              bug title
            </span>
          </div>
          <div className="w-full h-full mt-7">
            <div className="firstSection ">
              <span className="text-zinc-400 font-medium">
                Created 2 days ago
              </span>
              <h1 className="text-[1.5rem] font-bold">
                Login button unresponsive on Safari iOS 17.2
              </h1>
              <div className="flex items-center gap-3 text-sm mt-4">
                {/* Open */}
                <div className="flex items-center gap-2 px-4 py-1 rounded-lg border border-violet-200 bg-violet-50 text-violet-700">
                  <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                  <span className="font-normal">Open</span>
                </div>

                {/* High */}
                <div className="flex items-center gap-2 px-4 py-1 rounded-lg border border-orange-200 bg-orange-50 text-orange-700">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="font-normal">High</span>
                </div>

                {/* Production */}
                <div className="flex items-center gap-2 px-4 py-1 rounded-lg border border-green-200 bg-green-50 text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="font-normal">Production</span>
                </div>

                {/* Auth */}
                <div className="flex items-center gap-2 px-4 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                  <span className="font-normal">Auth</span>
                </div>

                {/* Divider */}
                <span className="mx-1 h-6 w-px bg-slate-200"></span>

                {/* Updated */}
                <div className="flex items-center gap-2 text-slate-400">
                  <i className="ri-time-line text-lg"></i>
                  <span className="font-normal">Updated 3 hours ago</span>
                </div>
              </div>
            </div>
            <hr className="text-zinc-200 mt-15" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5 ">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Sections go here */}
                <Section title="Description">
                  <p className="text-zinc-700 text-[1.04rem] leading-relaxed">
                    On iOS 17.2 using Safari, tapping the "Login" button on the
                    sign-in page produces no response. The button visually
                    depresses but the form submission never fires. The issue is
                    <strong> only reproducible on Safari iOS</strong> — Chrome
                    on iOS and all desktop browsers work as expected.
                  </p>
                </Section>
                <Section title="Steps to Reproduce">
                  <ol className="space-y-2 list-decimal list-inside text-zinc-700">
                    <li>Open Safari on iPhone with iOS 17.2+</li>
                    <li>
                      Navigate to{" "}
                      <code className="bg-zinc-100 px-1 py-0.5 rounded text-sm">
                        https://app.example.com/login
                      </code>
                    </li>
                    <li>Enter valid credentials</li>
                    <li>Tap the Login button — no action occurs</li>
                    <li>Verify in DevTools that submit is never called</li>
                  </ol>
                </Section>
                <Section title="Analysis">
                  <p className="text-zinc-700 mb-4">
                    The root cause appears to be a conflict between our custom
                    scroll handler and Safari 17’s passive event behavior.
                  </p>

                  <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto">
                    {`// Problematic pattern in auth/LoginForm.tsx
button.addEventListener('touchstart', handler, { passive: false });`}
                  </pre>

                  <div className="mt-4 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                    <span>⚠️</span>
                    <p>
                      Also affects signup and password-reset forms — patch all
                      at once.
                    </p>
                  </div>
                </Section>
                <Section title="Screenshots">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 flex items-center justify-center text-zinc-400">
                      safari-login-tap.png
                    </div>
                    <div className="border rounded-lg p-4 flex items-center justify-center text-zinc-400">
                      network-log-empty.png
                    </div>
                  </div>
                </Section>
                <Section title="Resolution">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                    <div className="font-semibold mb-1">✅ Fix Applied</div>
                    <p>
                      Removed passive:false from touchstart listeners and
                      replaced with pointer-events approach compatible with
                      Safari 17+.
                    </p>
                    <span className="inline-block mt-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      PR #438 • merged
                    </span>
                  </div>
                </Section>
                <Section title="Tags">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "#safari",
                      "#ios",
                      "#auth",
                      "#touch-events",
                      "#regression",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-sm bg-violet-50 text-violet-700 border border-violet-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <ActionsCard />
                <DetailsCard />
                <RelatedBugsCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
