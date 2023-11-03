import OpenAI from 'openai';




const getData = async (openai: any) => {

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: `Contempary Storage and Security (Aiden)
    What does NAS stand for ???→Network-attached security
    Are NAS devices secure???→No they are made for ease of use not security and can be hacked remotely
    What common mistakes do homeowners make regarding NAS devices that allows them to be easily hacked ???→Not changing a devices default password,  not updating to the latest version of a software
    How can you minimize the security risk to your data ???→Use a complex password, and ensure the latest update is installed
    What are the advantages of a USB drive ???→They are easy to transport, relatively cheap for the amount of storage offered, and are easy to use
    What are the disadvantages of a USB drive ???→People can carry large amount of sensitive data with them and potentially lose it and anyone can access the information if the drive is not encrypted, Employees can steal data perhaps to sell to someone else
    
Vocab
    Link to Chapter
    bisak my.sharepoint.com/:f:/g/personal/sleroy bisak org/Eiy8mbnQ5INCikmt ZfhL 4BJLRKLCMKnWh91EdoRGw8Jw?e=9naDun 
    
    VOCAB (Huzaifa, David)
    Subject vocabulary:
    Cyber attack↔any kind of malicious attack on a network-connected device 
    social engineering↔any kind of attack on a computer system or network that takes advantage of how people behave and respond to certain situations
    phishing↔attempting to get confidential information by sending a user a message that appears to come from a trustworthy person or organisation
    shoulder surfing↔gaining access to information by watching someone enter it into a computer system
    pharming↔directing internet users to a fake website that looks like a real one, in order to obtain personal information such as passwords, account numbers, etc. 
    unpatched software↔software that hasn't has the latest security updates applied to it, making it vulnerable to attack
    code vulnerability↔a computer program that has been written in such a way that it creates a security issue that may be taken advantage of to gain access to the computer system or data within it 
    
    
    General vocabulary:
    vulnerable↔easy to damage  
    labour intensive↔requires a lot of time and effort
    chronological↔The order in which they occured 
    
    
    Security and Its Importance (Shamekh, Alya)
        Reasons why security is important 
            required for the running of the organization 
                The business might have details of it's customers, stock and outstanding orders saved on the network. If the data were lost and the business failed to fulfil any remaining orders, this could mean losing the trust of customers who then go somewhere else.
                How can an organization be affected by poor security↓
                    Loss of important information
                    Losing trust in customers
                    Failure to fulfil any remaining orders
                What type of details are commonly stolen↓
                    Identity 
                    Financial information
                    Purchases
            Private and confidential  
                There are many types of private and confidential data that people or businesses wouldn't want to make public. For example, a hospital stores patient details on it's network. including medical conditions and what drugs have been prescribed.
                Why would a user not want private and confidential information to be exposed↓
                    Loss of the data
                    Data that shouldn't be shared to the public 
                How would a hospital be in risk of information being stolen↓
                    Information on prescription
                    Patient details
            Financially valuable   
                Many types of data stored on business networks might be financially valuable
                What type of financial information is most likely to be in risk of being stolen?↓
                    Credit Card information
                    Business financial documents
            
            
            
    
    Authentication and Validation (Martin)
    
    Other ways to secure a network (Salma)
    
    Cloud Storage and Security (Zainab)
    
    Contempary Storage and Security (Aiden)
    
    Cyber Attacks (Maryam, Dana)
    
    Types of Cyber Attack (Ioannis, Tawfik)
    
    Protecting against weaknesses (Sandy)
    
    Other measures
    
    Identifying Vulnerabilities
Link to Chapter
bisak my.sharepoint.com/:f:/g/personal/sleroy bisak org/Eiy8mbnQ5INCikmt ZfhL 4BJLRKLCMKnWh91EdoRGw8Jw?e=9naDun 

Vocab part 1
    Key Terms
        network security→security designed to protect a network and its data from threats (e.g viruses)
        two-factor authentication→security check where users enter a code
        denial of service→attack on network that attempts to prevent legitimate users from accessing the networks services
        access control→decides what users have access to which data and what they can do with it
        hacking→act of gaining unauthorized access to a computer system
        throughput→allows more data to be passed through them
        physical security→controls access to parts of a network using physical methods like a locked door instead of software
        malware→used as a generic term for any kind of software used to disrupt a computer system (it is also short for 'malicious software') 
        USB→stands for 'Universal Serial Bus' sockets found on most modern computer systems 
VOCAB (Huzaifa, David)



Authentication and Validation (Martin)
    Authentication→Authentication is the process of checking to see whether a user matches a certain identity. This is usually done by asking for a username and password compared to details stored on a central server. However, there are other methods of authentication/verification, such as using a PIN (personal identification number), fingerprint recognition, or Face ID, which companies such as Apple have recently implemented.
    Passwords→However, the use of passwords could be seen as quite a weak method of verification. This is because some people use very guessable passwords (pets name, birthday, etc.). This can be countered by two-factor-authentication, which is a security check where users have to type in the code from a portable device called a 'secure token' or from an SMS message sent to their mobile phone.
    
Cyber Attacks (Mariam, Dana)
    What are cyber attacks?→Any kind of electronic attack on computer system, server, network or any other IT device.
    What attacks might occur?
        Gaining access to data contained within the system.
        Delete or modify information
        Make the system unavailable for use
        Physically damage a device connected to the network (usually by overriding safety limits)
    
Protecting against weaknesses (Sandy)
    Link to Chapter
    bisak my.sharepoint.com/:f:/g/personal/sleroy bisak org/Eiy8mbnQ5INCikmt ZfhL 4BJLRKLCMKnWh91EdoRGw8Jw?e=9naDun 
    Protecting against weaknesses (Sandy)
    
    Security must be considered at the system and software or application design stage if a piece of software is→to be as safe as possible against cyber attack.
    
    The software and system designers will need to consider the following, for example↓
        What kind of authentication is needed? 
        Do different users need different levels of access to the information stored?
        within the system? 
        Should wamings be issued before allowing users to carry out potentially risky operations such as copying or deleting large amounts of information? 
        Does stored data need to be encrypted?
        What threats will the software face? 
        Will the software be run on computers that are connected to the Internet? 
        How do they guard against phishing? malware and other hacking attempts?
    
    
    Once the designers have considered security, they need to look at the? One major issue at this point is? Another major issue is that?→1, implementation (writing the code) phase. 2, guarding against bad programming practice. 3, some methods used in programming might lead to code vulnerabilities.
    
    Issues can be minimized by having regular code reviews. There are two main types of code review. which are ?→Review by another programmer and an automated review.
    
    
    
    
Types of Cyber Attack  (Ioannis, Tawfik)
    cyber attack→any kind of malicious attach on a network-connected device
    social engineering→anu kind of attack on a computer system or network that takes advantage of how people behave and respond to certain situations
    phishing→attempting to get confidential information by sending a user a message that appears to come from a trustworthy person or organisation
    shoulder surfing→gaining access to information by watching someone enter it into a computer or organization
    pharming→directing internet users to a fake website that looks like a real one, in order to obtain personal information such as passwords, account numbers 
    unpatched software→software that hasn't had the latest security updates applied to it, making it vulnerable to attack
    vulnerable→easy to hurt 
    

Cloud Storage and Security (Zainab)
    advantages
        cloud storage provider is responsible for the hardware your data is stored on. they make sure the data is accessible 
        amount of storage available can easily be changed and when needed, can make extra storage available in minutes. 
        having the data stored off-site means that it is protected from the loss due to fire, theft, electrical failure...etc. 
        they can also manage the back-up of your data. they may take daily screen snapshots of data and be able to restore them in case of accidental deletion of files or hardware failure
    disadvantages
        relying on a third-party storage provider to keep it running.
        data stored anywhere accessible via internet has a risk of other people gaining access. 
        users of cloud have to assume that the people providing the service are trustworthy and their data is being held safely and securely
        cloud storage provider might have serves located in different countries to teh organisation. 
        access to could storage is dependent on reliable, high-speed internet connection availability.
    how can impact of risks be reduced?
        many cloud storages will store your data at multiple locations so that fire, flood, hardware or electrical failure shouldn't have a major impact
        you can encrypt your data so that its more difficult to read while its being transferred to/from the cloud storage provider to stored on providers servers.
    
Other ways to secure a network 
    Access control→controls whether a particular user will gain access to a particular file. 
    Access control decides whether the user gets:
        read-only access ⇒ can't modify or edit the file.
        read and write access ⇒ can alter the file and save the changes.
    Full control of the file means you are able to delete the file.
    Firewall (such as the Internet)↔is a network security system that monitors and controls data that is moving from one network to another, and it could be software or hardware. 
    A firewall inspects incoming and outgoing data and uses a set of rules known as↔firewall policy.
    What's the job of the firewall policy↔the rules decide whether to allow the data to move from one network to another or now in order to secure the internal network from a range of potential threats. 
    What can firewall policy do?→stop attempts at hacking, blocks data coming from or going to certain network addresses, and stops certain protocols from being copied to external servers. 
    Physical security→controls access to critical parts of a network using physical methods rather than software. 
    Physical security includes→protecting against theft of equipment, security tagging and physically locking down equipment.  
    Server room→is the starting point of physical security and it's having the servers located in a locked room.  
    Advantages of electronic lock systems include→entry/exit times are recorded, individual cards/fobs can be deactivated if lost or if an employee leaves the company. 
    
    
Network security and its importance
    Network security and its importance: 
        Confidentiality↓
            networks ensure that only authorised users can access the parts of a network and its resources
            it stops misuse by giving permission to users 
            data is encrypted so that other users aren't allowed to read the data without the encryption key
        
        Correctness→Use of network to communicate and store data must not change data or allow data to be changed without authorisation
        
        Availability→Networks can be accessed when needed however complex systems can fail at times
        Networks attacks can↓
            slow down network
            deleted data
            data being stolen or eavesdropped on
            alter data or program code
    
Identifying Vulnerabilities (Mariam, Dana)
    What are ethical hacking?→A branch of computer science that relates to cyber security and prevents cyber attacks from being successful.
    What is good hacking?→Looking for weaknesses in software in systems so it can be imporved.
    What is bad hacking?→Someone trying to gain access to a system to steal data or cause damage.
    What are the ways in which vulnerabilities are identified?
        Penetration testing
        Commercial analyzing tools
    What is penetration testing?→The IT systems of an organization are deliberately attacked to find any weaknesses legally (cuz it's authorized by an organization.)
    What is a pen tester's goal?→Trying to gain access to all the systems that the organization has and the attacks will often include looking for technical weaknesses and trying social engineering methods.
    
    What is commercial analysis tools?→Scanners that scan a system for vulnerabilities.
    How are commercial analysis tools used?→Purchased or hired to scan a network from within (internally or externally).
    How are internal scans helpful?→Shows issues that could be exploited by a rogue employee or a hacker who is trying to get into the building or gain access to the network.
    How are external scans helpful?→Shows the vulnerabilities that the hacker could exploit from outside the company network.
    What is a downside of commercial analysis tools?→The analysis tools are really restricted in terms of who can purchase them so potential hackers could use them to find security vulnerabilities.
    
    What are the reviews of network and user policies?
        Who is authorised to carry out various activities on the network.
        How and when patches to software should be applied.
        Access controls.
        Password requirements, including how complex passwords should be and how often they should be changed
        How security is set up and maintained on the network.
        What data audit trails should collect and how long they should be kept for.
        Anything else relevant to the security and maintenance of the network.
    
    How do employees have access to the network?→They should be given a copy of the network user policy to  read/sign to show they accept the rules of the network use. 
    What are user policies most likely to contain?
        What use of the network is allowed/not allowed
        What will happen to user if they do something unacceptable (depending on the severity)
        How to report faults, problems, and security issues.
        Security information, such as good practice when choosing and using passwords.


    Create 3 multichoice questions to test that pupils have read and understood this text.  Give the results in JSON format, including answer and explanation.
` }],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion;
}

const getDataMock = async (openai: any) => {

  const mockValue = {
    "id": "chatcmpl-8EX5Qb3YEtYQVMqTF4khspI9FNYBt",
    "object": "chat.completion",
    "created": 1698474468,
    "model": "gpt-3.5-turbo-0613",
    "choices": [
      {
        "index": 0,
        "message": {
          "role": "assistant",
          "content": "{\"questions\": [\n  {\n    \"question\": \"What is the process of checking to see if a user matches a certain identity called?\",\n    \"choices\": [\n      \"Authentication\",\n      \"Authorization\",\n      \"Verification\",\n      \"Validation\"\n    ],\n    \"answer\": \"Authentication\",\n    \"explanation\": \"Authentication is the process of checking to see whether a user matches a certain identity.\"\n  },\n  {\n    \"question\": \"What is one advantage of using a cloud storage provider for data storage?\",\n    \"choices\": [\n      \"Data is protected from loss due to fire or theft\",\n      \"Data can be easily accessed from anywhere with an internet connection\",\n      \"Data can be stored at multiple locations for redundancy\",\n      \"All of the above\"\n    ],\n    \"answer\": \"All of the above\",\n    \"explanation\": \"One advantage of using a cloud storage provider is that data is protected from loss due to fire, theft, or electrical failure. Another advantage is that data can be easily accessed from anywhere with an internet connection. Additionally, many cloud storage providers store data at multiple locations for redundancy.\"\n  },\n  {\n    \"question\": \"What is the purpose of a firewall?\",\n    \"choices\": [\n      \"To prevent unauthorized access to a network\",\n      \"To encrypt data during transfer\",\n      \"To store and manage data on a network\",\n      \"To control access to network resources\"\n    ],\n    \"answer\": \"To prevent unauthorized access to a network\",\n    \"explanation\": \"The purpose of a firewall is to prevent unauthorized access to a network. It does this by monitoring and controlling the data that moves between networks, using a set of rules known as a firewall policy.\"\n  }\n]}"
        },
        "finish_reason": "stop"
      }
    ],
    "usage": {
      "prompt_tokens": 3159,
      "completion_tokens": 350,
      "total_tokens": 3509
    }
  };


  return Promise.resolve(mockValue);
}

const topics = ["What is Business?", "What are Business Activities?"]

export default async function Home() {

  const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"]
  });

  const chatCompletion = await getDataMock(openai);

  const questions = JSON.parse(chatCompletion.choices[0].message.content).questions;
  
  //return <></>;
   
  console.log(JSON.stringify(chatCompletion, null, 2));

  return <>

    <div>
        {topics.map((t, i)=> <div key={i}><a href={`/test-api/${t}`}>{t}</a></div>)}
    </div>
    {questions.map((q: any, i: any) => <div key={i}>{q.question}
      <ul>
        {q.choices.map((c: any, i: any) => <li key={i}>{c} </li> )}
      </ul>
      <div>{
          q.answer
        }</div>
    </div>)}

    <pre>{JSON.stringify(questions, null, 2)}</pre>
    
  </>
}