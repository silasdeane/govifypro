import { useState } from 'react';
import { 
  Search, ChevronDown, Filter, Download, Plus, 
  FileText, RefreshCw, AlertCircle, CheckCircle,
  Trash2, Archive, Flag, Users, MoreHorizontal,
  ArrowRight, Info, Send, Paperclip, X
} from 'lucide-react';

const GovifyEmailPage = () => {
  // State for tracking read/unread status of emails
  const [readEmails, setReadEmails] = useState({1: true});
  const [selectedEmail, setSelectedEmail] = useState(1);
  const [showAIResponse, setShowAIResponse] = useState(false);
  
  // Sample email data
  const emails = [
    { 
      id: 1,
      sender: 'John Smith',
      email: 'john.smith@example.com',
      subject: 'Question about road repairs on Main Street',
      preview: 'I am writing to inquire about the scheduled road repairs on Main Street. Our local business association is concerned about...',
      fullContent: `Dear Mayor Thompson,

I am writing to inquire about the scheduled road repairs on Main Street. Our local business association is concerned about...

Our local business association, representing over 40 merchants on Main Street, is concerned about the potential disruption to foot traffic and parking during this construction period. Many of our businesses are still recovering from the economic impacts of recent years, and a prolonged disruption could be severely detrimental.

Could you please provide us with more information about the construction timeline, planned hours of operation, and any measures being taken to maintain access to businesses?

Additionally, we would appreciate the opportunity to discuss potential accommodations for affected businesses, such as temporary signage, alternative parking solutions, or possible financial relief measures during the construction period.

Thank you for your attention to this matter.

Sincerely,
John Smith`,
      time: '10:23 AM',
      date: 'Today',
      tag: 'infrastructure',
      hasAttachment: false,
      isConstituent: true
    },
    { 
      id: 2,
      sender: 'Sarah Johnson',
      email: 'sarah.j@cityplanning.gov',
      subject: 'Request for information about the new recycling initiative',
      preview: 'I recently heard about the city\'s new recycling initiative and would like to know more details about how it will be implemented in...',
      fullContent: `I recently heard about the city's new recycling initiative and would like to know more details about how it will be implemented in our neighborhood. Could you provide information on collection schedules and accepted materials?`,
      time: '9:45 AM',
      date: 'Yesterday',
      tag: 'environment',
      hasAttachment: false,
      isConstituent: true
    },
    { 
      id: 3,
      sender: 'Michael Williams',
      email: 'mwilliams@community.org',
      subject: 'Feedback on the recent town hall meeting',
      preview: 'I attended the town hall meeting last Tuesday and wanted to share some thoughts about the proposed budget allocation for...',
      fullContent: `I attended the town hall meeting last Tuesday and wanted to share some thoughts about the proposed budget allocation for our community programs. I believe we should prioritize youth education initiatives.`,
      time: '2:30 PM',
      date: 'Yesterday',
      tag: 'general',
      hasAttachment: false,
      isConstituent: true
    },
    { 
      id: 4,
      sender: 'Tech Conference',
      email: 'events@govtech.org',
      subject: 'Invitation to speak at GovTech Summit 2025',
      preview: 'We would be honored to have you as a keynote speaker at the upcoming GovTech Summit. The event will focus on...',
      fullContent: `We would be honored to have you as a keynote speaker at the upcoming GovTech Summit. The event will focus on innovative technologies for local government administration.`,
      time: '11:15 AM',
      date: 'Apr 3',
      tag: 'invitation',
      hasAttachment: false,
      isConstituent: false
    },
    { 
      id: 5,
      sender: 'Robert Chen',
      email: 'robert.c@district5.gov',
      subject: 'Concerns about park safety in District 5',
      preview: 'As a resident of District 5, I am writing to express my concerns about safety in Riverside Park. Recently, there have been several...',
      fullContent: `As a resident of District 5, I am writing to express my concerns about safety in Riverside Park. Recently, there have been several incidents during evening hours that have made community members feel unsafe.`,
      time: '3:45 PM',
      date: 'Apr 2',
      tag: 'public safety',
      hasAttachment: false,
      isConstituent: true
    },
    { 
      id: 6,
      sender: 'Education Board',
      email: 'board@education.gov',
      subject: 'Upcoming vote on school funding allocation',
      preview: 'This is a reminder that the vote on the proposed school funding allocation will take place next Monday. The agenda includes...',
      fullContent: `This is a reminder that the vote on the proposed school funding allocation will take place next Monday. The agenda includes reviewing the district's budget priorities for the upcoming academic year.`,
      time: '10:00 AM',
      date: 'Apr 1',
      tag: 'education',
      hasAttachment: true,
      isConstituent: false
    }
  ];

  // Current email response
  const [draftResponse, setDraftResponse] = useState(
    `Dear Mr. Smith,

Thank you for reaching out about the scheduled road repairs on Main Street. I understand your concerns about the potential impact on local businesses.

The Public Works Department has scheduled these repairs to take place during off-peak hours (9 PM - 5 AM) specifically to minimize disruption to businesses. The project timeline has been condensed from the originally planned 3 weeks to just 10 days.

I've spoken with the project manager, and they've assured me that access to all businesses will be maintained throughout the construction period. Additionally, temporary signage will be provided to direct customers to available parking alternatives.

I've attached the detailed schedule and a map of the construction zones for your reference. Please feel free to share this with the business association. If you have any further questions or concerns, please don't hesitate to contact my office or reach out directly to James Wilson, the project coordinator, at jwilson@publicworks.gov.

Sincerely,
Mayor Thompson`
  );

  // Toggle AI response visibility
  const toggleAIResponse = () => {
    setShowAIResponse(!showAIResponse);
  };

  // Handle clicking on an email
  const handleEmailClick = (emailId) => {
    // Mark the email as read
    setReadEmails(prev => ({
      ...prev,
      [emailId]: true
    }));
    // Set as selected email
    setSelectedEmail(emailId);
    // Hide AI response when switching emails
    setShowAIResponse(false);
  };

  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Flagged', 'Constituent', 'Unread'];
  
  const selectedEmailData = emails.find(email => email.id === selectedEmail);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Header with title */}
      <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-indigo-900">Chief of Staff</h1>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 rounded-lg text-sm flex items-center bg-white text-indigo-600 border border-slate-200">
            <Plus size={16} className="mr-1.5" /> New Message
          </button>
          <button className="px-3 py-1.5 rounded-lg text-sm flex items-center bg-indigo-600 text-white">
            <Download size={16} className="mr-1.5" /> Connect Gmail
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with email folders */}
        <div className="w-56 border-r border-slate-200 bg-white">
          <div className="py-2">
            <div className="flex items-center px-4 py-3 text-indigo-900 bg-indigo-50">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-indigo-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex items-center">
                <span className="font-medium">Inbox</span>
                <div className="ml-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</div>
              </div>
            </div>
            
            <div className="flex items-center px-4 py-3 hover:bg-slate-50 text-slate-700">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-slate-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12L11 22L9 20M2 12L13 2L15 4L4.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Sent</span>
            </div>
            
            <div className="flex items-center px-4 py-3 hover:bg-slate-50 text-slate-700">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-slate-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8H19M5 8C3.89543 8 3 7.10457 3 6V4C3 2.89543 3.89543 2 5 2H19C20.1046 2 21 2.89543 21 4V6C21 7.10457 20.1046 8 19 8M5 8V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Archived</span>
            </div>
            
            <div className="flex items-center px-4 py-3 hover:bg-slate-50 text-slate-700">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 text-slate-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Trash</span>
            </div>
          </div>
          
          <div className="pt-4 pb-2 px-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CATEGORIES</h3>
          </div>
          
          <div className="py-1">
            <div className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
              <span>Infrastructure</span>
            </div>
            <div className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Environment</span>
            </div>
            <div className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span>Public Safety</span>
            </div>
            <div className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span>Education</span>
            </div>
            <div className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Community</span>
            </div>
            <div className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              <span>+ Add Category</span>
            </div>
          </div>
        </div>
        
        {/* Middle column with email list */}
        <div className="w-96 border-r border-slate-200 flex flex-col bg-gray-50">
          {/* Search and filters */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <div className="flex space-x-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`px-3 py-1 text-xs rounded-md ${
                    activeFilter === filter 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
              <button className="ml-auto px-2 py-1 text-xs border border-slate-200 rounded-md bg-white">
                <ChevronDown size={14} className="text-slate-500" />
              </button>
            </div>
          </div>
          
          {/* Email list */}
          <div className="flex-1 overflow-y-auto">
            {emails.map((email) => (
              <div 
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`border-b border-slate-200 cursor-pointer ${
                  selectedEmail === email.id ? 'bg-indigo-50' : 
                  readEmails[email.id] ? 'bg-indigo-50/40' : 'bg-white'
                }`}
              >
                <div className="p-3">
                  <div className="flex items-center">
                    {!readEmails[email.id] && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${!readEmails[email.id] ? 'text-indigo-900' : 'text-slate-700'}`}>
                          {email.sender}
                        </span>
                        <span className="text-xs text-slate-500">{email.time}</span>
                      </div>
                      
                      <h3 className={`text-sm mt-1 ${!readEmails[email.id] ? 'font-medium text-slate-900' : 'font-normal text-slate-700'}`}>
                        {email.subject}
                      </h3>
                      
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{email.preview}</p>
                      
                      {email.isConstituent && (
                        <div className="mt-1.5">
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded inline-flex items-center">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1"></div>
                            Constituent
                          </span>
                          <span className="text-xs ml-1 bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                            {email.tag}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Email content and reply area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Email content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-slate-900">{selectedEmailData.subject}</h2>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-medium mr-3">
                    {selectedEmailData.sender.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{selectedEmailData.sender}</div>
                    <div className="text-sm text-slate-500">From: {selectedEmailData.email}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-500">{selectedEmailData.time}</div>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none">
              {selectedEmailData.fullContent.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          {/* AI assistance prompt */}
          {!showAIResponse && (
            <div className="border-t border-slate-200 p-3 bg-white flex items-center justify-between">
              <div className="flex items-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-600 mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.6001 9H20.4001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.6001 15H20.4001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm text-slate-700">Need help with your response?</span>
              </div>
              <button 
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg flex items-center"
                onClick={toggleAIResponse}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1.5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 10L14 6M18 10L14 14M18 10H8C6.93913 10 5.92172 10.4214 5.17157 11.1716C4.42143 11.9217 4 12.9391 4 14C4 15.0609 4.42143 16.0783 5.17157 16.8284C5.92172 17.5786 6.93913 18 8 18H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Write AI Response
              </button>
            </div>
          )}
          
          {/* Nova AI draft response - conditionally rendered */}
          {showAIResponse && (
            <div className="bg-indigo-100 p-4 border-t border-indigo-200">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M12 16.9999V17.0099M12 6.99994V12.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="text-indigo-800 font-medium">Nova AI Draft Response</div>
                <div className="text-xs text-indigo-600 ml-2">Generated based on constituent history and request</div>
                <button 
                  className="ml-auto text-xs bg-white text-indigo-700 border border-indigo-300 px-3 py-1 rounded hover:bg-indigo-50"
                >
                  Regenerate
                </button>
                <button className="ml-2 text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                  Use Draft
                </button>
                <button 
                  className="ml-2 text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-white"
                  onClick={toggleAIResponse}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="bg-white border border-indigo-200 rounded-lg p-4 text-sm text-slate-700">
                {draftResponse.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
          
          {/* Reply area */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-2">
                <button className="text-slate-600 hover:text-indigo-600 p-1.5 rounded-md hover:bg-slate-100">
                  <Paperclip size={16} />
                </button>
                <button className="text-slate-600 hover:text-indigo-600 p-1.5 rounded-md hover:bg-slate-100">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11H15M9 7H15M9 15H13M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="text-slate-600 hover:text-indigo-600 p-1.5 rounded-md hover:bg-slate-100">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5 4H9.5M14.5 20H9.5M8 16.5C6.067 16.5 4.5 14.933 4.5 13V11C4.5 9.067 6.067 7.5 8 7.5H16C17.933 7.5 19.5 9.067 19.5 11V13C19.5 14.933 17.933 16.5 16 16.5H8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg flex items-center">
                <Send size={14} className="mr-1.5" /> Send Reply
              </button>
            </div>
            <textarea 
              className="w-full p-3 border border-slate-200 rounded-lg text-sm"
              placeholder="Type your response here..."
              rows={4}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovifyEmailPage;