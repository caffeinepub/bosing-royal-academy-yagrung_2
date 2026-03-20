import Storage "blob-storage/Storage";

module {
  type OldActor = {
    // All old fields including from MixinStorage
    // MixinStorage fields
  };

  type NewActor = {
    // All new fields including from MixinStorage
    logoBlob : ?Storage.ExternalBlob;
    // MixinStorage fields
  };

  public func run(old : OldActor) : NewActor {
    { old with logoBlob = null };
  };
};
