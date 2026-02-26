import React, { useState, useMemo } from 'react';
import SubsCriptionTab from './SubscriptionTab';
// import AccountSetting from './AccountSetting';
import { SystemIcon } from '../../assets/svgIcon/SystemIcon';
// import { AccountIcon } from '../../assets/svgIcon/AccountIcon';
import { SubscriptionIcon } from '../../assets/svgIcon/SubscriptionIcon';
import { 
  useGetPlatformSettingsQuery, 
  useUpdatePlatformSettingsMutation 
} from '../../redux/features/admin/settingsApi';
import { useAppSelector } from '../../redux/hook';
import { toast } from 'react-toastify';


interface SettingItemProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  title, 
  description, 
  checked, 
  onChange
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
          checked ? 'bg-purple-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

type TabType = 'system' | 'subscription' ;

interface Settings {
  maintenance_mode: boolean;
  smtp_email_service: boolean;
  welcome_email: boolean;
  reminder_email: boolean;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('system');

  //  ADD: Get token from Redux
  const token = useAppSelector((state) => state.auth.token);

  //  CHANGE: Add skip option
  const { data: settingsData, isLoading, error } = useGetPlatformSettingsQuery(undefined, {
    skip: !token, // Don't call API if no token
  });
  
  const [updateSettings, { isLoading: isSaving }] = useUpdatePlatformSettingsMutation();

  const initialSettings: Settings = settingsData ?? {
    maintenance_mode: false,
    smtp_email_service: false,
    welcome_email: true,
    reminder_email: true,
  };

  const [edits, setEdits] = useState<Partial<Settings>>({});

  const currentSettings: Settings = {
    ...initialSettings,
    ...edits,
  };

  const hasChanges = useMemo(() => {
    return Object.keys(edits).length > 0;
  }, [edits]);

  const handleSettingChange = (field: keyof Settings, value: boolean) => {
    setEdits(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(currentSettings).unwrap();
      setEdits({});
          toast.success(" Settings saved successfully!", {position: "top-right"}); 
      console.log('Settings saved successfully!');
    } catch (error) {
       toast.error(" Failed to save settings. Please try again.", {position: "top-right"});
      console.error('Failed to save settings:', error);
    }
  };

  const tabs = [
    { id: 'system' as TabType, label: 'System', icon: <SystemIcon /> },
    { id: 'subscription' as TabType, label: 'Subscription', icon: <SubscriptionIcon /> },
    // { id: 'account' as TabType, label: 'Account Setting', icon: <AccountIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'system':
        // 🟢 ADD: Check if token exists first
        if (!token) {
          return (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-3"></div>
                <p className="text-gray-600">Authenticating...</p>
              </div>
            </div>
          );
        }

        if (isLoading) {
          return (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center py-12 text-red-600">
                Failed to load settings. Please try again.
              </div>
            </div>
          );
        }

        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
          
            </div>

            <div className="space-y-1">
              <SettingItem
                title="Maintenance Mode"
                description="Enable maintenance mode to restrict access to the platform"
                checked={currentSettings.maintenance_mode}
                onChange={(value) => handleSettingChange('maintenance_mode', value)}
              />
              <SettingItem
                title="SMTP Email Service"
                description="Enable SMTP email service for sending emails"
                checked={currentSettings.smtp_email_service}
                onChange={(value) => handleSettingChange('smtp_email_service', value)}
              />
              <SettingItem
                title="Welcome Emails"
                description="Send welcome emails to new users"
                checked={currentSettings.welcome_email}
                onChange={(value) => handleSettingChange('welcome_email', value)}
              />
              <SettingItem
                title="Reminder Emails"
                description="Send reminder emails to users"
                checked={currentSettings.reminder_email}
                onChange={(value) => handleSettingChange('reminder_email', value)}
              />
            </div>

               <div className='flex items-center justify-end'>
                 <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`px-6 py-2.5 rounded-lg font-medium  transition-all duration-200 cursor-pointer ${
                  hasChanges && !isSaving
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </button>
               </div>

            {hasChanges && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  ⚠️ You have unsaved changes. Click "Save" to apply your changes.
                </p>
              </div>
            )}
          </div>
        );
      case 'subscription':
        return <SubsCriptionTab />;
      // case 'account':
      //   return <AccountSetting />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Settings</h1>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="transition-all duration-300">{renderContent()}</div>
    </div>
  );
}




// import React, { useState } from 'react';

// import SubsCriptionTab from './SubscriptionTab';
// import AccountSetting from './AccountSetting';
// import { SystemIcon } from '../../assets/svgIcon/SystemIcon';
// import { AccountIcon } from '../../assets/svgIcon/AccountIcon';
// import { SubscriptionIcon } from '../../assets/svgIcon/SubscriptionIcon';


// interface SettingItemProps {
//   title: string;
//   description: string;
//   checked: boolean;
//   onChange: (checked: boolean) => void;
// }

// const SettingItem: React.FC<SettingItemProps> = ({ title, description, checked, onChange }) => {
//   return (
//     <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
//       <div className="flex-1">
//         <h3 className="text-sm sm:text-base font-medium text-gray-900">{title}</h3>
//         <p className="text-xs sm:text-sm text-gray-500 mt-1">{description}</p>
//       </div>
//       <button
//         onClick={() => onChange(!checked)}
//         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
//           checked ? 'bg-purple-600' : 'bg-gray-200'
//         }`}
//       >
//         <span
//           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//             checked ? 'translate-x-6' : 'translate-x-1'
//           }`}
//         />
//       </button>
//     </div>
//   );
// };

// type TabType = 'system' | 'subscription' | 'account';

// export default function AdminSettings() {
//   const [activeTab, setActiveTab] = useState<TabType>('system');
//   const [maintenanceMode, setMaintenanceMode] = useState(false);
//   const [smtpEmail, setSmtpEmail] = useState(false);
//   const [welcomeEmails, setWelcomeEmails] = useState(true);
//   const [reminderEmails, setReminderEmails] = useState(true);

//   const tabs = [
//     { id: 'system' as TabType, label: 'System', icon: <SystemIcon/>},
//     { id: 'subscription' as TabType, label: 'Subscription', icon: <SubscriptionIcon/> },
//     { id: 'account' as TabType, label: 'Account Setting', icon:<AccountIcon/> },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'system':
//         return (
//           <div className="">
//             <SettingItem
//               title="Maintenance Mode"
//               description="Temporarily disable user access"
//               checked={maintenanceMode}
//               onChange={setMaintenanceMode}
//             />
//             <SettingItem
//               title="SMTP Email Service"
//               description="Enable email notifications and transactional emails"
//               checked={smtpEmail}
//               onChange={setSmtpEmail}
//             />
//             <SettingItem
//               title="Welcome Emails"
//               description="Send welcome email to new users"
//               checked={welcomeEmails}
//               onChange={setWelcomeEmails}
//             />
//             <SettingItem
//               title="Reminder Emails"
//               description="Send reminder emails for journal entries and supplements"
//               checked={reminderEmails}
//               onChange={setReminderEmails}
//             />
//           </div>
//         );
//       case 'subscription':
//         return (
//           <SubsCriptionTab/>
//         );
//       case 'account':
//         return (
//           <AccountSetting/>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="">
//       <div className="">
//         <div className="bg-white rounded-3xl shadow-xl overflow-hidden ">
//           {/* Header */}
//           <div className="p-2.5 md:p-6 ">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
//               Admin Settings
//             </h1>

//             {/* Tabs */}
//             <div className="flex flex-wrap  lg:bg-[#F5F6FD] p-2 rounded-full max-w-lg items-center justify-center gap-2 sm:gap-3">
//               {tabs.map((tab) => {
            
//                 const isActive = activeTab === tab.id;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer ${
//                       isActive
//                         ? 'bg-purple-600 text-white shadow-lg shadow-purple-300'
//                         : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {tab.icon}
//                     <span>{tab.label}</span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Content */}
//           <div className="px-6 pb-6 ">
//             <div className="">
//               {renderContent()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }