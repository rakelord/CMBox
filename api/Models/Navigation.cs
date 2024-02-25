namespace Models {
    public class Navigation {
        public int Unique_id { get; set; }
        public string Display_name { get; set; } = "";
        public string Page_name { get; set; } = "";
        public bool Is_parent { get; set; }
        public int? Parent_id { get; set; }
        public string? Icon { get; set; }
        public DateTime? Changed_date { get; set; }
        public DateTime Creation_date { get; set; }
    }
}