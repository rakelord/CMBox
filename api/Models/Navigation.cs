namespace Models {
    public class Navigation {
        public string DisplayName { get; set; } = "";
        public string Page_Name { get; set; } = "";
        public bool Nav_Parent { get; set; }
        public int? Parent_Id { get; set; }
        public string? Icon { get; set; }
    }
}