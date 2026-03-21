import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /*********** Types **************/
  public type UserProfile = {
    name : Text;
  };

  type Content = {
    id : Nat;
    title : Text;
    content : Text;
    date : Time.Time;
    author : Text;
    published : Bool;
  };

  module Content {
    public func compare(content1 : Content, content2 : Content) : Order.Order {
      Nat.compare(content1.id, content2.id);
    };
  };

  type Event = {
    id : Nat;
    title : Text;
    description : Text;
    date : Time.Time;
    location : Text;
    published : Bool;
  };

  module Event {
    public func compare(event1 : Event, event2 : Event) : Order.Order {
      Nat.compare(event1.id, event2.id);
    };
  };

  type Staff = {
    id : Nat;
    name : Text;
    role : Text;
    department : Text;
    bio : Text;
    photoUrl : ?Text;
    order : Nat;
  };

  module Staff {
    public func compare(staff1 : Staff, staff2 : Staff) : Order.Order {
      Nat.compare(staff1.id, staff2.id);
    };
  };

  type GalleryImage = {
    id : Nat;
    title : Text;
    imageUrl : Text;
    category : Text;
    date : Time.Time;
  };

  module GalleryImage {
    public func compare(image1 : GalleryImage, image2 : GalleryImage) : Order.Order {
      Nat.compare(image1.id, image2.id);
    };
  };

  type FAQ = {
    id : Nat;
    question : Text;
    answer : Text;
    order : Nat;
    published : Bool;
  };

  module FAQ {
    public func compare(faq1 : FAQ, faq2 : FAQ) : Order.Order {
      Nat.compare(faq1.id, faq2.id);
    };
  };

  type Achievement = {
    id : Nat;
    title : Text;
    description : Text;
    year : Nat;
    category : Text;
  };

  module Achievement {
    public func compare(achievement1 : Achievement, achievement2 : Achievement) : Order.Order {
      Nat.compare(achievement1.id, achievement2.id);
    };
  };

  type AdmissionInfo = {
    processSteps : Text;
    requirements : Text;
    fees : Text;
    contact : Text;
  };

  type SiteInfo = {
    schoolName : Text;
    tagline : Text;
    address : Text;
    phone : Text;
    email : Text;
    about : Text;
    principalName : Text;
    principalMessage : Text;
  };

  type GalleryItem = {
    id : Nat;
    title : Text;
    blob : Storage.ExternalBlob;
    category : Text;
    date : Time.Time;
  };

  module GalleryItem {
    public func compare(item1 : GalleryItem, item2 : GalleryItem) : Order.Order {
      Nat.compare(item1.id, item2.id);
    };
  };

  /*********** Stable Storage **************/
  stable var newsCounter = 0;
  stable var eventsCounter = 0;
  stable var staffCounter = 0;
  stable var galleryCounter = 0;
  stable var faqsCounter = 0;
  stable var achievementsCounter = 0;

  stable var siteInfo : ?SiteInfo = null;
  stable var admissionInfo : ?AdmissionInfo = null;
  stable var logoBlob : ?Storage.ExternalBlob = null;
  stable var menuConfig : ?Text = null;

  // Stable arrays to persist data across upgrades
  stable var stableNews : [(Nat, Content)] = [];
  stable var stableEvents : [(Nat, Event)] = [];
  stable var stableStaff : [(Nat, Staff)] = [];
  stable var stableGallery : [(Nat, GalleryImage)] = [];
  stable var stableGalleryItems : [(Nat, GalleryItem)] = [];
  stable var stableFaqs : [(Nat, FAQ)] = [];
  stable var stableAchievements : [(Nat, Achievement)] = [];
  stable var stableUserProfiles : [(Principal, UserProfile)] = [];

  /*********** In-memory Maps **************/
  let news = Map.empty<Nat, Content>();
  let events = Map.empty<Nat, Event>();
  let staff = Map.empty<Nat, Staff>();
  let gallery = Map.empty<Nat, GalleryImage>();
  let galleryItems = Map.empty<Nat, GalleryItem>();
  let faqs = Map.empty<Nat, FAQ>();
  let achievements = Map.empty<Nat, Achievement>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Restore maps from stable arrays on canister start
  for ((k, v) in stableNews.vals()) { news.add(k, v) };
  for ((k, v) in stableEvents.vals()) { events.add(k, v) };
  for ((k, v) in stableStaff.vals()) { staff.add(k, v) };
  for ((k, v) in stableGallery.vals()) { gallery.add(k, v) };
  for ((k, v) in stableGalleryItems.vals()) { galleryItems.add(k, v) };
  for ((k, v) in stableFaqs.vals()) { faqs.add(k, v) };
  for ((k, v) in stableAchievements.vals()) { achievements.add(k, v) };
  for ((k, v) in stableUserProfiles.vals()) { userProfiles.add(k, v) };

  /*********** Upgrade Hooks **************/
  system func preupgrade() {
    stableNews := news.entries().toArray();
    stableEvents := events.entries().toArray();
    stableStaff := staff.entries().toArray();
    stableGallery := gallery.entries().toArray();
    stableGalleryItems := galleryItems.entries().toArray();
    stableFaqs := faqs.entries().toArray();
    stableAchievements := achievements.entries().toArray();
    stableUserProfiles := userProfiles.entries().toArray();
  };

  system func postupgrade() {
    stableNews := [];
    stableEvents := [];
    stableStaff := [];
    stableGallery := [];
    stableGalleryItems := [];
    stableFaqs := [];
    stableAchievements := [];
    stableUserProfiles := [];
  };

  /*********** User Profile **************/
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /*********** Logo Management **************/
  public shared ({ caller }) func setLogoBlob(blob : Storage.ExternalBlob) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    logoBlob := ?blob;
  };

  public query ({ caller }) func getLogoBlob() : async ?Storage.ExternalBlob {
    logoBlob;
  };

  /*********** Site Info **************/
  public shared ({ caller }) func setSiteInfo(info : SiteInfo) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    siteInfo := ?info;
  };

  public query ({ caller }) func getSiteInfo() : async ?SiteInfo {
    siteInfo;
  };

  /*********** Admissions **************/
  public shared ({ caller }) func setAdmissionInfo(info : AdmissionInfo) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    admissionInfo := ?info;
  };

  public query ({ caller }) func getAdmissionInfo() : async ?AdmissionInfo {
    admissionInfo;
  };

  /*********** News **************/
  public shared ({ caller }) func createNews(newsInput : Content) : async Content {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    let newsItem : Content = {
      id = newsCounter;
      title = newsInput.title;
      content = newsInput.content;
      date = newsInput.date;
      author = newsInput.author;
      published = newsInput.published;
    };
    news.add(newsCounter, newsItem);
    newsCounter += 1;
    newsItem;
  };

  public shared ({ caller }) func updateNews(id : Nat, newsInput : Content) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    switch (news.get(id)) {
      case (null) { Runtime.trap("News item not found") };
      case (?_) {
        let updatedNews : Content = {
          id;
          title = newsInput.title;
          content = newsInput.content;
          date = newsInput.date;
          author = newsInput.author;
          published = newsInput.published;
        };
        news.add(id, updatedNews);
      };
    };
  };

  public shared ({ caller }) func deleteNews(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    news.remove(id);
  };

  public query ({ caller }) func getAllNewsAdmin() : async [Content] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    news.values().toArray();
  };

  public query ({ caller }) func getPublishedNews() : async [Content] {
    news.values().toArray().filter(func(item) { item.published });
  };

  public query ({ caller }) func getNews(id : Nat) : async Content {
    switch (news.get(id)) {
      case (null) { Runtime.trap("News item not found") };
      case (?newsItem) {
        if (not newsItem.published and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot view unpublished content");
        };
        newsItem;
      };
    };
  };

  /*********** Events **************/
  public shared ({ caller }) func createEvent(eventInput : Event) : async Event {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    let eventItem : Event = {
      id = eventsCounter;
      title = eventInput.title;
      description = eventInput.description;
      date = eventInput.date;
      location = eventInput.location;
      published = eventInput.published;
    };
    events.add(eventsCounter, eventItem);
    eventsCounter += 1;
    eventItem;
  };

  public shared ({ caller }) func updateEvent(id : Nat, eventInput : Event) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?_) {
        let updatedEvent : Event = {
          id;
          title = eventInput.title;
          description = eventInput.description;
          date = eventInput.date;
          location = eventInput.location;
          published = eventInput.published;
        };
        events.add(id, updatedEvent);
      };
    };
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    events.remove(id);
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    events.values().toArray();
  };

  public query ({ caller }) func getPublishedEvents() : async [Event] {
    events.values().toArray().filter(func(item) { item.published });
  };

  public query ({ caller }) func getEvent(id : Nat) : async Event {
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        if (not event.published and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot view unpublished content");
        };
        event;
      };
    };
  };

  /*********** Staff **************/
  public shared ({ caller }) func createStaff(staffInput : Staff) : async Staff {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    let staffMember : Staff = {
      id = staffCounter;
      name = staffInput.name;
      role = staffInput.role;
      department = staffInput.department;
      bio = staffInput.bio;
      photoUrl = staffInput.photoUrl;
      order = staffInput.order;
    };
    staff.add(staffCounter, staffMember);
    staffCounter += 1;
    staffMember;
  };

  public shared ({ caller }) func updateStaff(id : Nat, staffInput : Staff) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    switch (staff.get(id)) {
      case (null) { Runtime.trap("Staff member not found") };
      case (?_) {
        let updatedStaff : Staff = {
          id;
          name = staffInput.name;
          role = staffInput.role;
          department = staffInput.department;
          bio = staffInput.bio;
          photoUrl = staffInput.photoUrl;
          order = staffInput.order;
        };
        staff.add(id, updatedStaff);
      };
    };
  };

  public shared ({ caller }) func deleteStaff(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    staff.remove(id);
  };

  public query ({ caller }) func getAllStaff() : async [Staff] {
    staff.values().toArray();
  };

  /*********** Gallery **************/
  public shared ({ caller }) func createGalleryImage(imageInput : GalleryImage) : async GalleryImage {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    let image : GalleryImage = {
      id = galleryCounter;
      title = imageInput.title;
      imageUrl = imageInput.imageUrl;
      category = imageInput.category;
      date = imageInput.date;
    };
    gallery.add(galleryCounter, image);
    galleryCounter += 1;
    image;
  };

  public shared ({ caller }) func updateGalleryImage(id : Nat, imageInput : GalleryImage) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    switch (gallery.get(id)) {
      case (null) { Runtime.trap("Gallery image not found") };
      case (?_) {
        let updatedImage : GalleryImage = {
          id;
          title = imageInput.title;
          imageUrl = imageInput.imageUrl;
          category = imageInput.category;
          date = imageInput.date;
        };
        gallery.add(id, updatedImage);
      };
    };
  };

  public shared ({ caller }) func deleteGalleryImage(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    gallery.remove(id);
  };

  public query ({ caller }) func getAllGalleryImages() : async [GalleryImage] {
    gallery.values().toArray();
  };

  public shared ({ caller }) func addGalleryItem(title : Text, category : Text, blob : Storage.ExternalBlob) : async GalleryItem {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    let item : GalleryItem = {
      id = galleryCounter;
      title;
      blob;
      category;
      date = Time.now();
    };
    galleryItems.add(galleryCounter, item);
    galleryCounter += 1;
    item;
  };

  public query ({ caller }) func getAllGalleryItems() : async [GalleryItem] {
    galleryItems.values().toArray();
  };

  /*********** FAQs **************/
  public shared ({ caller }) func createFAQ(faqInput : FAQ) : async FAQ {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    let faq : FAQ = {
      id = faqsCounter;
      question = faqInput.question;
      answer = faqInput.answer;
      order = faqInput.order;
      published = faqInput.published;
    };
    faqs.add(faqsCounter, faq);
    faqsCounter += 1;
    faq;
  };

  public shared ({ caller }) func updateFAQ(id : Nat, faqInput : FAQ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    switch (faqs.get(id)) {
      case (null) { Runtime.trap("FAQ not found") };
      case (?_) {
        let updatedFAQ : FAQ = {
          id;
          question = faqInput.question;
          answer = faqInput.answer;
          order = faqInput.order;
          published = faqInput.published;
        };
        faqs.add(id, updatedFAQ);
      };
    };
  };

  public shared ({ caller }) func deleteFAQ(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    faqs.remove(id);
  };

  public query ({ caller }) func getAllFAQs() : async [FAQ] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    faqs.values().toArray();
  };

  public query ({ caller }) func getPublishedFAQs() : async [FAQ] {
    faqs.values().toArray().filter(func(item) { item.published });
  };

  /*********** Achievements **************/
  public shared ({ caller }) func createAchievement(achievementInput : Achievement) : async Achievement {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    let achievement : Achievement = {
      id = achievementsCounter;
      title = achievementInput.title;
      description = achievementInput.description;
      year = achievementInput.year;
      category = achievementInput.category;
    };
    achievements.add(achievementsCounter, achievement);
    achievementsCounter += 1;
    achievement;
  };

  public shared ({ caller }) func updateAchievement(id : Nat, achievementInput : Achievement) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    switch (achievements.get(id)) {
      case (null) { Runtime.trap("Achievement not found") };
      case (?_) {
        let updatedAchievement : Achievement = {
          id;
          title = achievementInput.title;
          description = achievementInput.description;
          year = achievementInput.year;
          category = achievementInput.category;
        };
        achievements.add(id, updatedAchievement);
      };
    };
  };

  public shared ({ caller }) func deleteAchievement(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    achievements.remove(id);
  };

  public query ({ caller }) func getAllAchievements() : async [Achievement] {
    achievements.values().toArray();
  };

  /*********** Menu Config **************/
  public shared ({ caller }) func setMenuConfig(json : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Must be admin");
    };
    menuConfig := ?json;
  };

  public query func getMenuConfig() : async ?Text {
    menuConfig;
  };
};
