using System.ComponentModel.DataAnnotations;

namespace ReactProject.Models
{
    public partial class Product
    {
        public Product()
        {
            Sales = new HashSet<Sale>();
        }

        [Key]
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        public int? Price { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
