# frozen_string_literal: true

class RenameDeferredColumnsOnPostAction < ActiveRecord::Migration[4.2]
  def change
    rename_column :post_actions, :deferred_by_id, :deferred_by_id
    rename_column :post_actions, :deferred_at, :deferred_at
  end
end
